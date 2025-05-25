
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { LectoGuiaSimplified } from '@/components/lectoguia/LectoGuiaSimplified';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const LectoGuia: React.FC = () => {
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
              <BreadcrumbLink>LectoGuía IA</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <LectoGuiaSimplified />
      </div>
    </AppLayout>
  );
};

export default LectoGuia;
