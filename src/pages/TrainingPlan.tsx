
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { TrainingPlan, TrainingPlanFormData, TrainingLevel } from "@/types/trainingPlan";
import { trainingPlanApi } from "@/services/trainingPlanService";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TrainingPlanPage() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [formData, setFormData] = useState<TrainingPlanFormData>({
    Name: "",
    Objective: "",
    Level: TrainingLevel.Beginner,
    DurationWeeks: 4,
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch training plans
  const { data: trainingPlans, isLoading, error } = useQuery({
    queryKey: ["trainingPlans"],
    queryFn: trainingPlanApi.getAll,
  });

  // Create training plan mutation
  const createMutation = useMutation({
    mutationFn: trainingPlanApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainingPlans"] });
      toast.success("Training plan created successfully");
      setOpenDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error creating training plan: ${error.message}`);
    },
  });

  // Update training plan mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: number; plan: TrainingPlanFormData }) => 
      trainingPlanApi.update(data.id, data.plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainingPlans"] });
      toast.success("Training plan updated successfully");
      setOpenDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error updating training plan: ${error.message}`);
    },
  });

  // Delete training plan mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => trainingPlanApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainingPlans"] });
      toast.success("Training plan deleted successfully");
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Error deleting training plan: ${error.message}`);
    },
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "Level" || name === "DurationWeeks") {
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
    
    if (isEditing && selectedPlan) {
      updateMutation.mutate({ id: selectedPlan.id, plan: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Open the dialog for editing a training plan
  const handleEdit = (plan: TrainingPlan) => {
    setSelectedPlan(plan);
    setFormData({
      Name: plan.name,
      Objective: plan.objective,
      Level: plan.level,
      DurationWeeks: plan.durationWeeks,
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Open the dialog for creating a new training plan
  const handleCreate = () => {
    resetForm();
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Open the confirm dialog for deleting a training plan
  const handleDeleteClick = (plan: TrainingPlan) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };

  // Confirm and execute the deletion of a training plan
  const confirmDelete = () => {
    if (selectedPlan) {
      deleteMutation.mutate(selectedPlan.id);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      Name: "",
      Objective: "",
      Level: TrainingLevel.Beginner,
      DurationWeeks: 4,
    });
    setSelectedPlan(null);
  };

  // Get text representation of training level
  const getTrainingLevelText = (level: TrainingLevel): string => {
    switch (level) {
      case TrainingLevel.None: return "None";
      case TrainingLevel.Beginner: return "Beginner";
      case TrainingLevel.Intermediate: return "Intermediate";
      case TrainingLevel.Advanced: return "Advanced";
      default: return "Unknown";
    }
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Training Plans</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Plan
        </Button>
      </div>

      {isLoading ? (
        <p>Loading training plans...</p>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>Failed to load training plans: {(error as Error).message}</AlertDescription>
        </Alert>
      ) : (
        <Table>
          <TableCaption>List of all training plans</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Objective</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Duration (Weeks)</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainingPlans && trainingPlans.length > 0 ? (
              trainingPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{plan.objective}</TableCell>
                  <TableCell>{getTrainingLevelText(plan.level)}</TableCell>
                  <TableCell>{plan.durationWeeks}</TableCell>
                  <TableCell>{new Date(plan.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(plan)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(plan)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No training plans found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Add/Edit Training Plan Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Training Plan" : "Add New Training Plan"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update the details of your training plan." 
                : "Fill out the form below to create a new training plan."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <input
                  id="name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  className="col-span-3 w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="objective" className="text-right">
                  Objective
                </label>
                <textarea
                  id="objective"
                  name="Objective"
                  value={formData.Objective}
                  onChange={handleChange}
                  className="col-span-3 w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="level" className="text-right">
                  Level
                </label>
                <select
                  id="level"
                  name="Level"
                  value={formData.Level}
                  onChange={handleChange}
                  className="col-span-3 w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value={TrainingLevel.None}>None</option>
                  <option value={TrainingLevel.Beginner}>Beginner</option>
                  <option value={TrainingLevel.Intermediate}>Intermediate</option>
                  <option value={TrainingLevel.Advanced}>Advanced</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="duration" className="text-right">
                  Duration (Weeks)
                </label>
                <input
                  id="duration"
                  name="DurationWeeks"
                  type="number"
                  min="1"
                  value={formData.DurationWeeks}
                  onChange={handleChange}
                  className="col-span-3 w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpenDialog(false)}
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
              Are you sure you want to delete the training plan "{selectedPlan?.name}"? This action cannot be undone.
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
