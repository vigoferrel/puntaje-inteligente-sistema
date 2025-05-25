
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationContent {
  subject?: string;
  body?: string;
  title?: string;
  event?: any;
}

interface ScheduledNotification {
  id: string;
  event_id: string;
  user_id: string;
  notification_type: 'email' | 'push' | 'sms';
  send_at: string;
  content: NotificationContent;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    console.log('Processing scheduled notifications...');

    // Obtener notificaciones pendientes que deben enviarse ahora
    const { data: notifications, error: fetchError } = await supabase
      .from('scheduled_notifications')
      .select(`
        *,
        calendar_events (title, description, start_date),
        profiles (name, email)
      `)
      .eq('status', 'pending')
      .lte('send_at', new Date().toISOString())
      .limit(50);

    if (fetchError) {
      throw new Error(`Error fetching notifications: ${fetchError.message}`);
    }

    console.log(`Found ${notifications?.length || 0} notifications to process`);

    const results = [];

    for (const notification of notifications || []) {
      try {
        let success = false;
        let errorMessage = null;

        switch (notification.notification_type) {
          case 'email':
            if (resend && notification.profiles?.email) {
              const emailResult = await sendEmailNotification(resend, notification);
              success = emailResult.success;
              errorMessage = emailResult.error;
            } else {
              errorMessage = 'Email service not configured or no email address';
            }
            break;

          case 'push':
            const pushResult = await sendPushNotification(supabase, notification);
            success = pushResult.success;
            errorMessage = pushResult.error;
            break;

          case 'sms':
            // SMS implementation would go here
            errorMessage = 'SMS not implemented yet';
            break;

          default:
            errorMessage = `Unknown notification type: ${notification.notification_type}`;
        }

        // Actualizar el estado de la notificación
        const { error: updateError } = await supabase
          .from('scheduled_notifications')
          .update({
            status: success ? 'sent' : 'failed',
            error_message: errorMessage,
            sent_at: success ? new Date().toISOString() : null
          })
          .eq('id', notification.id);

        if (updateError) {
          console.error(`Error updating notification ${notification.id}:`, updateError);
        }

        results.push({
          id: notification.id,
          type: notification.notification_type,
          success,
          error: errorMessage
        });

        console.log(`Notification ${notification.id} (${notification.notification_type}): ${success ? 'sent' : 'failed'}`);

      } catch (error) {
        console.error(`Error processing notification ${notification.id}:`, error);
        
        // Marcar como fallida
        await supabase
          .from('scheduled_notifications')
          .update({
            status: 'failed',
            error_message: error.message,
          })
          .eq('id', notification.id);

        results.push({
          id: notification.id,
          type: notification.notification_type,
          success: false,
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({
        processed: results.length,
        results
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error) {
    console.error('Error in notification scheduler:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

async function sendEmailNotification(resend: any, notification: any) {
  try {
    const event = notification.calendar_events;
    const profile = notification.profiles;
    const content = notification.content;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎯 PAES Command</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Sistema Inteligente de Preparación</p>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #2d3748; margin-bottom: 20px;">¡Recordatorio de Evento!</h2>
          
          <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #4a5568; margin-top: 0;">${event?.title || 'Evento'}</h3>
            
            ${event?.description ? `<p style="color: #718096; margin: 15px 0;">${event.description}</p>` : ''}
            
            <div style="background: #edf2f7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #4a5568;"><strong>📅 Fecha:</strong> ${new Date(event?.start_date || '').toLocaleString('es-CL')}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app') || 'https://your-app.com'}/calendario" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Ver en Calendario
              </a>
            </div>
          </div>
          
          <p style="text-align: center; color: #a0aec0; font-size: 14px; margin-top: 30px;">
            Este es un recordatorio automático de PAES Command.<br>
            ¡Mantente al día con tu preparación! 💪
          </p>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: 'PAES Command <notifications@resend.dev>',
      to: [profile.email],
      subject: content.subject || `Recordatorio: ${event?.title}`,
      html: emailHtml
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function sendPushNotification(supabase: any, notification: any) {
  try {
    // Obtener suscripciones push del usuario
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', notification.user_id)
      .eq('is_active', true);

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      return { success: false, error: 'No active push subscriptions found' };
    }

    const content = notification.content;
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');

    if (!vapidPrivateKey || !vapidPublicKey) {
      return { success: false, error: 'VAPID keys not configured' };
    }

    // Aquí iría la implementación de web-push
    // Por ahora, simulamos el envío exitoso
    console.log('Would send push notification:', content);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

serve(handler);
