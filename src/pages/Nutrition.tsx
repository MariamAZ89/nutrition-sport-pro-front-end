
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nutritionApi } from "../services/nutritionService";
import { Nutrition, NutritionFormData } from "../types/nutrition";
import NutritionTable from "../components/nutrition/NutritionTable";
import NutritionForm from "../components/nutrition/NutritionForm";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "../components/ui/sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

const NutritionPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNutrition, setEditingNutrition] = useState<Nutrition | undefined>(undefined);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: "", description: "", variant: "default" });
  
  const queryClient = useQueryClient();
  
  // Fetch all nutrition records
  const { 
    data: nutritionRecords = [], 
    isLoading, 
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["nutrition"],
    queryFn: nutritionApi.getAll
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: NutritionFormData) => nutritionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition"] });
      refetch(); // Explicitly refetch data after mutation success
      showAlert("Success", "Nutrition record created successfully", "success");
      setIsFormOpen(false);
    },
    onError: (error) => {
      showAlert("Error", `Failed to create nutrition record: ${error.message}`, "error");
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: NutritionFormData }) => nutritionApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition"] });
      refetch(); // Explicitly refetch data after mutation success
      showAlert("Success", "Nutrition record updated successfully", "success");
      setIsFormOpen(false);
      setEditingNutrition(undefined);
    },
    onError: (error) => {
      showAlert("Error", `Failed to update nutrition record: ${error.message}`, "error");
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => nutritionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition"] });
      refetch(); // Explicitly refetch data after mutation success
      showAlert("Success", "Nutrition record deleted successfully", "success");
    },
    onError: (error) => {
      showAlert("Error", `Failed to delete nutrition record: ${error.message}`, "error");
    }
  });

  // Handlers
  const handleCreateClick = () => {
    setEditingNutrition(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (nutrition: Nutrition) => {
    setEditingNutrition(nutrition);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this nutrition record?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (data: NutritionFormData) => {
    if (editingNutrition) {
      updateMutation.mutate({ id: editingNutrition.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingNutrition(undefined);
  };

  // Helper for showing alerts
  const showAlert = (title: string, description: string, variant: "success" | "error" | "default") => {
    setAlertContent({
      title,
      description,
      variant
    });
    setAlertDialogOpen(true);
    
    // Also show toast for immediate feedback
    if (variant === "success") {
      toast.success(description);
    } else if (variant === "error") {
      toast.error(description);
    } else {
      toast(description);
    }
  };

  if (isError) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Error loading nutrition records: {error instanceof Error ? error.message : String(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nutrition Management</h1>
        <Button onClick={handleCreateClick} disabled={isFormOpen}>
          <Plus className="mr-1 h-4 w-4" /> Add New Record
        </Button>
      </div>

      {isFormOpen ? (
        <div className="card shadow-sm mb-6">
          <div className="card-body">
            <h2 className="card-title mb-4">
              {editingNutrition ? "Edit Nutrition Record" : "Add New Nutrition Record"}
            </h2>
            <NutritionForm
              nutrition={editingNutrition}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>
      ) : null}

      <div className="card shadow-sm">
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-6">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <NutritionTable
              nutritionRecords={nutritionRecords}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </div>

      {/* Alert Dialog for notifications */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NutritionPage;
