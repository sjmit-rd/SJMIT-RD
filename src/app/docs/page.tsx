'use client';
import React from 'react';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';
import { Card } from '@/components/ui/card';
import { ShieldCheck, Layers, PlusCircle, Pencil } from 'lucide-react';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

export default function DocsPage() {
  return (
    <ProtectedRoute>
      <PageContainer>
        <PageHeader
          title={<>Admin Portal <span className="text-gradient">Guide</span></>}
          description="Operational workflows for R&D Center Administrators to manage departments, facilities, services, and equipment."
        />

        <div className="space-y-8 max-w-4xl mx-auto">
          <Card className="p-6 border-l-4 border-l-brand-start bg-slate-50/50 dark:bg-white/5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="text-brand-start" /> Admin Workflow Overview
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Welcome to the administrator management portal. Use the admin tabs on the main admin page (<code className="bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded text-xs">/admin/</code>) to manage R&D infrastructure records in real-time.
            </p>
          </Card>

          {/* Flow 1: Departments */}
          <section className="space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="text-brand-start" size={20} /> 1. Academic Departments Management
            </h3>
            <Card className="p-6 space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Manage all academic departments associated with research activities.
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1.5">
                <li><strong>Add New Department</strong>: Click the floating <span className="font-bold text-brand-start">+</span> button or Navigate to <code className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">/admin/departments/new/</code>. Fill in department name, HOD details, contact email, and upload an optional image.</li>
                <li><strong>Edit Department</strong>: Click the pencil (<Pencil className="inline" size={14} />) button next to any department to edit its details (`/admin/departments/edit/?id=&lt;id&gt;`).</li>
                <li><strong>Delete Department</strong>: Click the trash button to delete a department.</li>
              </ul>
            </Card>
          </section>

          {/* Flow 2: Facilities & Services */}
          <section className="space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="text-brand-end" size={20} /> 2. Laboratories, Facilities & Testing Services
            </h3>
            <Card className="p-6 space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Organize specialized lab facilities and testing/analytical services.
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1.5">
                <li><strong>Add Facility / Service</strong>: Switch to the <strong>Facilities</strong> or <strong>Services</strong> tab in the admin panel and click the floating <span className="font-bold text-brand-start">+</span> button.</li>
                <li><strong>Add Equipment to Lab/Service</strong>: Expand any facility or service row and click <strong>+ Add Equipment</strong> to link specific machinery, computers, or testing tools to that lab.</li>
                <li><strong>Edit / Delete</strong>: Modify laboratory details or equipment availability status dynamically at any time.</li>
              </ul>
            </Card>
          </section>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}
