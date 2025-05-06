
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Statistic, StatisticFormData } from "@/types/training";
import { statisticsApi } from "@/services/statisticsService";
import { format, parseISO } from "date-fns";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function StatisticsPage() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStatistic, setSelectedStatistic] = useState<Statistic | null>(null);
  const [formData, setFormData] = useState<StatisticFormData>({
    Date: new Date().toISOString().split('T')[0],
    Weight: 70,
    MuscleMass: 30,
    FatMass: 15,
    HeartRate: 75,
    Notes: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch statistics entries
  const { data: statisticsEntries, isLoading, error } = useQuery({
    queryKey: ["statistics"],
    queryFn: statisticsApi.getAll,
  });

  // Create statistics entry mutation
  const createMutation = useMutation({
    mutationFn: statisticsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
      toast.success("Statistics entry created successfully");
      setOpenDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error creating statistics entry: ${error.message}`);
    },
  });

  // Update statistics entry mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: number; statistic: StatisticFormData }) => 
      statisticsApi.update(data.id, data.statistic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
      toast.success("Statistics entry updated successfully");
      setOpenDialog(false);
      resetForm();
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(`Error updating statistics entry: ${error.message}`);
    },
  });

  // Delete statistics entry mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => statisticsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
      toast.success("Statistics entry deleted successfully");
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Error deleting statistics entry: ${error.message}`);
    },
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "Weight" || name === "MuscleMass" || name === "FatMass" || name === "HeartRate") {
      setFormData({
        ...formData,
        [name]: Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isEditing && selectedStatistic) {
      updateMutation.mutate({ id: selectedStatistic.id, statistic: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Open the dialog for editing a statistics entry
  const handleEdit = (statistic: Statistic) => {
    setSelectedStatistic(statistic);
    setFormData({
      Date: statistic.date.split('T')[0],
      Weight: statistic.weight,
      MuscleMass: statistic.muscleMass,
      FatMass: statistic.fatMass,
      HeartRate: statistic.heartRate,
      Notes: statistic.notes,
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Open the dialog for creating a new statistics entry
  const handleCreate = () => {
    resetForm();
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Open the confirm dialog for deleting a statistics entry
  const handleDeleteClick = (statistic: Statistic) => {
    setSelectedStatistic(statistic);
    setDeleteDialogOpen(true);
  };

  // Confirm and execute the deletion of a statistics entry
  const confirmDelete = () => {
    if (selectedStatistic) {
      deleteMutation.mutate(selectedStatistic.id);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      Date: new Date().toISOString().split('T')[0],
      Weight: 70,
      MuscleMass: 30,
      FatMass: 15,
      HeartRate: 75,
      Notes: "",
    });
    setSelectedStatistic(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Statistics Entries</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Entry
        </Button>
      </div>

      {isLoading ? (
        <p>Loading statistics entries...</p>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>Failed to load statistics entries: {(error as Error).message}</AlertDescription>
        </Alert>
      ) : (
        <Table>
          <TableCaption>List of all statistics entries</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Weight (kg)</TableHead>
              <TableHead>Muscle Mass (kg)</TableHead>
              <TableHead>Fat Mass (kg)</TableHead>
              <TableHead>Heart Rate (bpm)</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statisticsEntries && statisticsEntries.length > 0 ? (
              statisticsEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{formatDate(entry.date)}</TableCell>
                  <TableCell>{entry.weight}</TableCell>
                  <TableCell>{entry.muscleMass}</TableCell>
                  <TableCell>{entry.fatMass}</TableCell>
                  <TableCell>{entry.heartRate}</TableCell>
                  <TableCell>{entry.notes}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(entry)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(entry)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No statistics entries found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Add/Edit Statistics Entry Dialog */}
      <Dialog 
        open={openDialog} 
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
            setIsEditing(false);
          }
          setOpenDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Statistics Entry" : "Add New Statistics Entry"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update the details of your statistics entry." 
                : "Fill out the form below to create a new statistics entry."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="date" className="text-right">
                  Date
                </label>
                <Input
                  id="date"
                  name="Date"
                  type="date"
                  value={formData.Date}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="weight" className="text-right">
                  Weight (kg)
                </label>
                <Input
                  id="weight"
                  name="Weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.Weight}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="muscleMass" className="text-right">
                  Muscle Mass (kg)
                </label>
                <Input
                  id="muscleMass"
                  name="MuscleMass"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.MuscleMass}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="fatMass" className="text-right">
                  Fat Mass (kg)
                </label>
                <Input
                  id="fatMass"
                  name="FatMass"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.FatMass}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="heartRate" className="text-right">
                  Heart Rate (bpm)
                </label>
                <Input
                  id="heartRate"
                  name="HeartRate"
                  type="number"
                  min="0"
                  value={formData.HeartRate}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="notes" className="text-right">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  name="Notes"
                  value={formData.Notes}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setOpenDialog(false);
                  resetForm();
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this statistics entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
