
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { SportsProfile, SportsProfileFormData, SportsProfileLevel } from "@/types/training";
import { sportsProfileApi } from "@/services/sportsProfileService";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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

export default function SportsProfilePage() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<SportsProfile | null>(null);
  const [formData, setFormData] = useState<SportsProfileFormData>({
    Weight: 70,
    Height: 170,
    Goals: "",
    Level: 1,
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch sports profiles
  const { data: sportsProfiles, isLoading, error } = useQuery({
    queryKey: ["sportsProfiles"],
    queryFn: sportsProfileApi.getAll,
  });

  // Create sports profile mutation
  const createMutation = useMutation({
    mutationFn: sportsProfileApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sportsProfiles"] });
      toast.success("Sports profile created successfully");
      setOpenDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error creating sports profile: ${error.message}`);
    },
  });

  // Update sports profile mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: number; profile: SportsProfileFormData }) => 
      sportsProfileApi.update(data.id, data.profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sportsProfiles"] });
      toast.success("Sports profile updated successfully");
      setOpenDialog(false);
      resetForm();
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(`Error updating sports profile: ${error.message}`);
    },
  });

  // Delete sports profile mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => sportsProfileApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sportsProfiles"] });
      toast.success("Sports profile deleted successfully");
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Error deleting sports profile: ${error.message}`);
    },
  });

  // Get level label based on level number
  const getLevelLabel = (level: number): string => {
    return SportsProfileLevel[level] || String(level);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "Weight" || name === "Height" || name === "Level") {
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
    
    if (isEditing && selectedProfile) {
      updateMutation.mutate({ id: selectedProfile.id, profile: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Open the dialog for editing a sports profile
  const handleEdit = (profile: SportsProfile) => {
    setSelectedProfile(profile);
    setFormData({
      Weight: profile.weight,
      Height: profile.height,
      Goals: profile.goals,
      Level: profile.level,
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Open the dialog for creating a new sports profile
  const handleCreate = () => {
    resetForm();
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Open the confirm dialog for deleting a sports profile
  const handleDeleteClick = (profile: SportsProfile) => {
    setSelectedProfile(profile);
    setDeleteDialogOpen(true);
  };

  // Confirm and execute the deletion of a sports profile
  const confirmDelete = () => {
    if (selectedProfile) {
      deleteMutation.mutate(selectedProfile.id);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      Weight: 70,
      Height: 170,
      Goals: "",
      Level: 1,
    });
    setSelectedProfile(null);
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sports Profile</h1>
        {(!sportsProfiles || sportsProfiles.length === 0) && (
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Profile
          </Button>
        )}
      </div>

      {isLoading ? (
        <p>Loading sports profile...</p>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>Failed to load sports profile: {(error as Error).message}</AlertDescription>
        </Alert>
      ) : (
        <div>
          {sportsProfiles && sportsProfiles.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {sportsProfiles.map((profile) => (
                <Card key={profile.id} className="shadow-md">
                  <CardHeader>
                    <CardTitle>Sports Profile</CardTitle>
                    <CardDescription>Your personal sports information</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="font-medium">{profile.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Height</p>
                        <p className="font-medium">{profile.height} cm</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Level</p>
                      <p className="font-medium">{getLevelLabel(profile.level)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Goals</p>
                      <p className="font-medium">{profile.goals}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">
                        {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 
                         new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" onClick={() => handleEdit(profile)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteClick(profile)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg bg-muted/20">
              <h3 className="text-xl font-semibold mb-2">No Sports Profile Found</h3>
              <p className="mb-4">Create your sports profile to track your fitness goals and progress.</p>
              <Button onClick={handleCreate} className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" /> Create Profile
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Sports Profile Dialog */}
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
            <DialogTitle>{isEditing ? "Edit Sports Profile" : "Create Sports Profile"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update your sports profile details." 
                : "Fill out the form below to create your sports profile."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
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
                <label htmlFor="height" className="text-right">
                  Height (cm)
                </label>
                <Input
                  id="height"
                  name="Height"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.Height}
                  onChange={handleChange}
                  className="col-span-3"
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
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="1">Beginner</option>
                  <option value="2">Intermediate</option>
                  <option value="3">Advanced</option>
                  <option value="4">Professional</option>
                  <option value="5">Elite</option>
                  <option value="6">Expert</option>
                  <option value="7">Master</option>
                  <option value="8">Champion</option>
                  <option value="9">Legend</option>
                  <option value="10">God</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="goals" className="text-right">
                  Goals
                </label>
                <Textarea
                  id="goals"
                  name="Goals"
                  value={formData.Goals}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="What are your fitness goals?"
                  required
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
              Are you sure you want to delete your sports profile? This action cannot be undone.
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
