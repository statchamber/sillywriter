"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TextFormatSettings } from "@/components/settings/text-format-settings"
import { DataManagement } from "@/components/settings/data-management"

export default function SettingsPage() {
  return (
    <div className="container p-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="text-format">Text Format</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="space-y-6">
            <DataManagement />
          </div>
        </TabsContent>
        
        <TabsContent value="text-format">
          <TextFormatSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
} 