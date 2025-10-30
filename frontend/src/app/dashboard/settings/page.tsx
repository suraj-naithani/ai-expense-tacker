"use client"

import { Database, Download, FileSpreadsheet, FileText, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function page() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleExport = (format: string) => {

    }

    const handleBackup = () => {

    }

    return (
        <div className="space-y-4 md:space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your data and account preferences</p>
            </div>

            <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
                <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Download className="h-5 w-5 text-[#6366f1]" />
                            <CardTitle>Export Data</CardTitle>
                        </div>
                        <CardDescription>
                            Download your transaction data and financial records in various formats.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]"
                            onClick={() => handleExport("CSV")}
                        >
                            <FileSpreadsheet className="mr-2 h-4 w-4 text-[#10b981]" />
                            Export as CSV
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]"
                            onClick={() => handleExport("JSON")}
                        >
                            <FileText className="mr-2 h-4 w-4 text-[#6366f1]" />
                            Export as JSON
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]"
                            onClick={() => handleExport("PDF Report")}
                        >
                            <FileText className="mr-2 h-4 w-4 text-[#f87171]" />
                            Export as PDF Report
                        </Button>
                    </CardContent>
                </Card>

                {/* Data Management */}
                <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-[#6366f1]" />
                            <CardTitle>Data Management</CardTitle>
                        </div>
                        <CardDescription>Manage your stored data and account information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Storage Used */}
                        <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-medium">Storage Used</div>
                                    <div className="text-sm text-muted-foreground">2.4 MB of data</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">127 transactions</div>
                                    <div className="text-sm text-muted-foreground">8 categories</div>
                                </div>
                            </div>
                        </div>

                        {/* Backup All Data */}
                        <Button
                            variant="outline"
                            className="w-full justify-start border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]"
                            onClick={handleBackup}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Backup All Data
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Settings Sections */}
            <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
                {/* Account Settings */}
                <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your account preferences and security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]"
                        >
                            <User className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Privacy Settings
                        </Button>
                    </CardContent>
                </Card>

                {/* Preferences */}
                <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>Customize your app experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]"
                        >
                            Currency Settings
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]"
                        >
                            Notification Preferences
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
