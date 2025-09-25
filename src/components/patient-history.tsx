import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, Download, Plus, Calendar } from 'lucide-react';

export function PatientHistory() {
  const [records] = useState([
    {
      id: 1,
      date: '2024-01-15',
      type: 'Consultation',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Routine Checkup',
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-01-10',
      type: 'Lab Results',
      doctor: 'Dr. Michael Chen',
      diagnosis: 'Blood Work',
      status: 'Available'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Patient Records</h2>
        <p className="text-muted-foreground">
          Secure digital storage of patient history, prescriptions, and lab results.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Medical Records
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records.map((record) => (
              <Card key={record.id} className="border border-gray-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{record.type}</h4>
                      <p className="text-sm text-muted-foreground">{record.doctor}</p>
                      <p className="text-sm">{record.diagnosis}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{record.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{record.status}</Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}