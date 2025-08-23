
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLearningNodes } from "@/hooks/use-learning-nodes";
import { Skeleton } from "@/components/ui/skeleton";

const NodeDetail = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const { nodes, loading, fetchNodeContent } = useLearningNodes();
  const [content, setContent] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(true);
  
  // Encontrar el nodo actual basado en el ID de la URL
  const currentNode = nodes.find(node => node.id === nodeId);
  
  useEffect(() => {
    const loadNodeContent = async () => {
      if (nodeId) {
        setLoadingContent(true);
        try {
          const nodeContent = await fetchNodeContent(nodeId);
          setContent(nodeContent);
        } catch (error) {
          console.error("Error loading node content:", error);
        } finally {
          setLoadingContent(false);
        }
      }
    };
    
    loadNodeContent();
  }, [nodeId, fetchNodeContent]);
  
  return (
    <AppLayout>
      <div className="container py-8">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Inicio</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/plan">Plan</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Nodo de aprendizaje</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/plan" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver al plan
            </Link>
          </Button>
          
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">{currentNode?.title || "Nodo de aprendizaje"}</h1>
              </div>
              <p className="text-muted-foreground mt-1">
                {currentNode?.description || "Contenido de aprendizaje personalizado"}
              </p>
            </>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Contenido</CardTitle>
            <CardDescription>
              Material de aprendizaje para este nodo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingContent ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : content ? (
              <div>
                {/* Aquí iría el renderizado real del contenido */}
                <p>El contenido detallado estará disponible próximamente.</p>
              </div>
            ) : (
              <p>No se encontró contenido para este nodo de aprendizaje.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default NodeDetail;
