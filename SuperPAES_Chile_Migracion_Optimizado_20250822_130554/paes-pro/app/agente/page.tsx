'use client'

import { useState, useRef, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { Send, Bot, User, Lightbulb, BookOpen, Target, Zap, MessageSquare } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  typing?: boolean
}

const predefinedQuestions = [
  {
    icon: BookOpen,
    question: "¿Cómo puedo mejorar mi comprensión lectora?",
    category: "Estudio"
  },
  {
    icon: Target,
    question: "¿Qué estrategias me recomiendas para el PAES?",
    category: "Estrategia"
  },
  {
    icon: Lightbulb,
    question: "Explícame un tema específico de matemáticas",
    category: "Contenido"
  },
  {
    icon: Zap,
    question: "Genera ejercicios de práctica para mí",
    category: "Práctica"
  }
]

export default function AgentePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de estudio inteligente para la PAES. Estoy aquí para ayudarte con tus estudios, generar contenido personalizado, responder dudas y guiarte en tu preparación. ¿En qué puedo ayudarte hoy? 🎓',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim()
    if (!messageText || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      typing: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      // Preparar conversación para la API
      const conversation = messages
        .filter(msg => !msg.typing)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          conversation: conversation.slice(-10) // Mantener últimos 10 mensajes para contexto
        })
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Remove typing indicator and add real response
      setMessages(prev => 
        prev.filter(msg => msg.id !== 'typing').concat({
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        })
      )
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove typing indicator and show error
      setMessages(prev => 
        prev.filter(msg => msg.id !== 'typing').concat({
          id: Date.now().toString(),
          role: 'assistant',
          content: '❌ Lo siento, hubo un error al procesar tu mensaje. Por favor intenta nuevamente. Si el problema persiste, verifica tu conexión a internet.',
          timestamp: new Date()
        })
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue])

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-700 p-4 bg-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Asistente IA PAES</h1>
              <p className="text-gray-400 text-sm">Tu tutor personal inteligente</p>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">En línea</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.length === 1 && (
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {predefinedQuestions.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(item.question)}
                      className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-left transition-all duration-200 hover:border-purple-500 group"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs text-purple-400 font-medium">{item.category}</span>
                      </div>
                      <p className="text-gray-200 text-sm">{item.question}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-purple-600' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}>
                  {message.typing ? (
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-400 text-sm ml-2">Escribiendo...</span>
                    </div>
                  ) : (
                    <div className="whitespace-pre-line">{message.content}</div>
                  )}
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-700 p-4 bg-gray-800">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta aquí... (Shift + Enter para nueva línea)"
                className="chat-input max-h-32 min-h-[44px] resize-none"
                disabled={isLoading}
                rows={1}
              />
            </div>
            
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className={`p-2 rounded-lg transition-all duration-200 ${
                inputValue.trim() && !isLoading
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <span>💡 Pregúntame sobre cualquier tema de la PAES</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-3 h-3" />
              <span>{messages.length - 1} mensaje{messages.length !== 2 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
