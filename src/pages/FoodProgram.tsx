
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { foodProgramApi } from '@/services/foodProgramService';
import { FoodProgram, FoodProgramFormData } from '@/types/foodProgram';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2 } from "lucide-react";

const FoodProgramPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState<FoodProgramFormData>({
    Name: '',
    Description: '',
    GenerationAI: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch food programs
  const { 
    data: foodPrograms = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['foodPrograms'],
    queryFn: foodProgramApi.getAll,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: foodProgramApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodPrograms'] });
      toast({
        title: "Success",
        description: "Food program created successfully!",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create food program: ${error.message}`,
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FoodProgramFormData }) => 
      foodProgramApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodPrograms'] });
      toast({
        title: "Success",
        description: "Food program updated successfully!",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update food program: ${error.message}`,
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: foodProgramApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodPrograms'] });
      toast({
        title: "Success",
        description: "Food program deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete food program: ${error.message}`,
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && currentId) {
      updateMutation.mutate({ id: currentId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
    
    setIsFormOpen(false);
  };

  const handleEdit = (foodProgram: FoodProgram) => {
    setFormData({
      Name: foodProgram.name,
      Description: foodProgram.description,
      GenerationAI: foodProgram.generationAI
    });
    setCurrentId(foodProgram.id);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Description: '',
      GenerationAI: ''
    });
    setCurrentId(null);
    setIsEditing(false);
    setIsFormOpen(false);
  };

  const openNewForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading food programs...</div>;
  }

  if (error) {
    return (
      <div className="text-destructive p-4 rounded-md bg-destructive/10">
        Error loading food programs: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Food Programs</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Food Program
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit' : 'Add'} Food Program</DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? 'Update the food program details below.' 
                  : 'Create a new food program by filling out the form below.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea
                    id="description"
                    name="Description"
                    value={formData.Description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="generationAI" className="text-right">Generation AI</Label>
                  <Input
                    id="generationAI"
                    name="GenerationAI"
                    value={formData.GenerationAI}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {foodPrograms.length === 0 ? (
        <div className="text-center p-8 bg-muted rounded-lg">
          <p className="text-muted-foreground">No food programs found. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodPrograms.map((foodProgram) => (
            <Card key={foodProgram.id} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{foodProgram.name}</CardTitle>
                <CardDescription>Created: {new Date(foodProgram.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-medium">Generation AI:</span> {foodProgram.generationAI}
                </p>
                <p className="text-sm">{foodProgram.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(foodProgram)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the food program "{foodProgram.name}".
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(foodProgram.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodProgramPage;
