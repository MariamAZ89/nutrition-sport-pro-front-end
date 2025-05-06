
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Training, TrainingFormData } from "@/types/training";
import { trainingApi } from "@/services/trainingService";
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

export default function TrainingPage() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [formData, setFormData] = useState<TrainingFormData>({
    Date: new Date().toISOString().split('T')[0],
    Duration: 30,
    Notes: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch training entries
  const { data: trainingEntries, isLoading, error } = useQuery({
    queryKey: ["training"],
    queryFn: trainingApi.getAll,
  });

  // Create training entry mutation
  const createMutation = useMutation({
    mutationFn: trainingApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training"] });
      toast.success("Training entry created successfully");
      setOpenDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error creating training entry: ${error.message}`);
    },
  });

  // Update training entry mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: number; training: TrainingFormData }) => 
      trainingApi.update(data.id, data.training),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training"] });
      toast.success("Training entry updated successfully");
      setOpenDialog(false);
      resetForm();
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(`Error updating training entry: ${error.message}`);
    },
  });

  // Delete training entry mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => trainingApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training"] });
      toast.success("Training entry deleted successfully");
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Error deleting training entry: ${error.message}`);
    },
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "Duration") {
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
    
    if (isEditing && selectedTraining) {
      updateMutation.mutate({ id: selectedTraining.id, training: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Open the dialog for editing a training entry
  const handleEdit = (training: Training) => {
    setSelectedTraining(training);
    setFormData({
      Date: training.date.split('T')[0],
      Duration: training.duration,
      Notes: training.notes,
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Open the dialog for creating a new training entry
  const handleCreate = () => {
    resetForm();
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Open the confirm dialog for deleting a training entry
  const handleDeleteClick = (training: Training) => {
    setSelectedTraining(training);
    setDeleteDialogOpen(true);
  };

  // Confirm and execute the deletion of a training entry
  const confirmDelete = () => {
    if (selectedTraining) {
      deleteMutation.mutate(selectedTraining.id);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      Date: new Date().toISOString().split('T')[0],
      Duration: 30,
      Notes: "",
    });
    setSelectedTraining(null);
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
        <h1 className="text-2xl font-bold">Training Entries</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Entry
        </Button>
      </div>

      {isLoading ? (
        <p>Loading training entries...</p>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>Failed to load training entries: {(error as Error).message}</AlertDescription>
        </Alert>
      ) : (
        <Table>
          <TableCaption>List of all training entries</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Duration (min)</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainingEntries && trainingEntries.length > 0 ? (
              trainingEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{formatDate(entry.date)}</TableCell>
                  <TableCell>{entry.duration}</TableCell>
                  <TableCell>{entry.notes}</TableCell>
                  <TableCell>{new Date(entry.createdAt).toLocaleDateString()}</TableCell>
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
                <TableCell colSpan={5} className="text-center py-4">
                  No training entries found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Add/Edit Training Entry Dialog */}
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
            <DialogTitle>{isEditing ? "Edit Training Entry" : "Add New Training Entry"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update the details of your training entry." 
                : "Fill out the form below to create a new training entry."}
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
                <label htmlFor="duration" className="text-right">
                  Duration (min)
                </label>
                <Input
                  id="duration"
                  name="Duration"
                  type="number"
                  min="1"
                  value={formData.Duration}
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
              Are you sure you want to delete this training entry? This action cannot be undone.
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
