"use client"

import { useState } from "react"
import { Plus, Search, Settings2, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorldInfoList } from "@/components/world-info/world-info-list"
import { CreateWorldInfoDialog } from "@/components/world-info/create-world-info-dialog"
import { CreateCollectionDialog } from "@/components/world-info/create-collection-dialog"
import { ManageCollectionsDialog } from "@/components/world-info/manage-collections-dialog"
import { CollectionSelector } from "@/components/world-info/collection-selector"
import { ImportExportDialog } from "@/components/world-info/import-export-dialog"

export default function WorldInfoPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showCreateCollectionDialog, setShowCreateCollectionDialog] = useState(false)
  const [showManageCollectionsDialog, setShowManageCollectionsDialog] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showImportExportDialog, setShowImportExportDialog] = useState(false)

  return (
    <div className="container p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">World Information</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImportExportDialog(true)}>
            <FileDown className="mr-2 h-4 w-4" />
            Import/Export
          </Button>
          <Button variant="outline" onClick={() => setShowManageCollectionsDialog(true)}>
            <Settings2 className="mr-2 h-4 w-4" />
            Manage Collections
          </Button>
          <Button variant="outline" onClick={() => setShowCreateCollectionDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Collection
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <CollectionSelector
          selectedCollection={selectedCollection}
          onSelect={setSelectedCollection}
        />
      </div>

      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="location">Locations</TabsTrigger>
          <TabsTrigger value="object">Objects</TabsTrigger>
          <TabsTrigger value="lore">Lore</TabsTrigger>
          <TabsTrigger value="subplot">Subplots</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
          <TabsTrigger value="global">Global</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <WorldInfoList 
            category="all" 
            searchQuery={searchQuery} 
            collectionId={selectedCollection}
          />
        </TabsContent>
        <TabsContent value="location" className="mt-6">
          <WorldInfoList category="location" searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="object" className="mt-6">
          <WorldInfoList category="object" searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="lore" className="mt-6">
          <WorldInfoList category="lore" searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="subplot" className="mt-6">
          <WorldInfoList category="subplot" searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="other" className="mt-6">
          <WorldInfoList category="other" searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="global" className="mt-6">
          <WorldInfoList category="global" searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>

      <CreateWorldInfoDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        collectionId={selectedCollection}
      />
      <CreateCollectionDialog
        open={showCreateCollectionDialog}
        onOpenChange={setShowCreateCollectionDialog}
      />
      <ManageCollectionsDialog 
        open={showManageCollectionsDialog}
        onOpenChange={setShowManageCollectionsDialog}
      />
      <ImportExportDialog 
        open={showImportExportDialog} 
        onOpenChange={setShowImportExportDialog} 
      />
    </div>
  )
} 