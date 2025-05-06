
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Exercise, ExerciseFormData } from "../types/exercise";
import { exerciseApi } from "../services/exerciseService";
import { trainingApi } from "../services/trainingService";
import { Training } from "../types/training";
import { Plus, Edit, Trash2 } from "lucide-react";

const exerciseSchema = z.object({
  Duration: z.coerce.number().min(0, "Duration must be a positive number"),
  Repetitions: z.coerce.number().int().min(0, "Repetitions must be a positive integer"),
  Sets: z.coerce.number().int().min(0, "Sets must be a positive integer"),
  Weight: z.coerce.number().min(0, "Weight must be a positive number"),
  TrainingId: z.coerce.number().int().positive("Please select a training session")
});

const ExercisePage = () => {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  
  const form = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      Duration: 0,
      Repetitions: 0,
      Sets: 0,
      Weight: 0,
      TrainingId: 0
    }
  });
  
  // Fetch exercises and training sessions
  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      const data = await exerciseApi.getAll();
      setExercises(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch exercises. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTrainings = async () => {
    try {
      const data = await trainingApi.getAll();
      setTrainings(data);
    } catch (error) {
      console.error("Error fetching training sessions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch training sessions. Please try again later."
      });
    }
  };

  useEffect(() => {
    fetchExercises();
    fetchTrainings();
  }, []);
  
  // Form submission handler
  const onSubmit = async (values: z.infer<typeof exerciseSchema>) => {
    try {
      setIsLoading(true);
      
      const exerciseData: ExerciseFormData = {
        Duration: values.Duration,
        Repetitions: values.Repetitions,
        Sets: values.Sets,
        Weight: values.Weight,
        TrainingId: values.TrainingId
      };
      
      if (editingExercise) {
        await exerciseApi.update(editingExercise.id, exerciseData);
        toast({
          title: "Exercise updated",
          description: "Exercise has been successfully updated."
        });
      } else {
        await exerciseApi.create(exerciseData);
        toast({
          title: "Exercise created",
          description: "New exercise has been successfully created."
        });
      }
      
      // Reset form and state
      form.reset();
      setEditingExercise(null);
      setIsDialogOpen(false);
      fetchExercises();
    } catch (error) {
      console.error("Error submitting exercise:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${editingExercise ? "update" : "create"} exercise. Please try again.`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete exercise handler
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this exercise?")) {
      try {
        setIsLoading(true);
        await exerciseApi.delete(id);
        fetchExercises();
        toast({
          title: "Exercise deleted",
          description: "Exercise has been successfully deleted."
        });
      } catch (error) {
        console.error("Error deleting exercise:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete exercise. Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Edit exercise handler
  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    form.reset({
      Duration: exercise.duration,
      Repetitions: exercise.repetitions,
      Sets: exercise.sets,
      Weight: exercise.weight,
      TrainingId: exercise.trainingId
    });
    setIsDialogOpen(true);
  };
  
  // Add new exercise handler
  const handleAddNew = () => {
    setEditingExercise(null);
    form.reset({
      Duration: 0,
      Repetitions: 0,
      Sets: 0,
      Weight: 0,
      TrainingId: 0
    });
    setIsDialogOpen(true);
  };

  // Find training name by ID
  const getTrainingName = (trainingId: number) => {
    const training = trainings.find(t => t.id === trainingId);
    return training ? `${new Date(training.date).toLocaleDateString()} (${training.notes})` : "Unknown";
  };
  
  return (
    <div className="container px-4 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Exercises</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Exercise
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingExercise ? "Edit Exercise" : "Add New Exercise"}</DialogTitle>
                <DialogDescription>
                  {editingExercise 
                    ? "Update the exercise details below." 
                    : "Fill in the details to create a new exercise."}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="TrainingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Training Session</FormLabel>
                        <FormControl>
                          <select
                            className="w-full px-3 py-2 border rounded-md"
                            disabled={isLoading}
                            {...field}
                          >
                            <option value={0}>Select Training Session</option>
                            {trainings.map((training) => (
                              <option key={training.id} value={training.id}>
                                {new Date(training.date).toLocaleDateString()} - {training.notes}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="Duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="Sets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sets</FormLabel>
                        <FormControl>
                          <Input type="number" disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="Repetitions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repetitions</FormLabel>
                        <FormControl>
                          <Input type="number" disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="Weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Processing..." : (editingExercise ? "Update Exercise" : "Create Exercise")}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading && exercises.length === 0 ? (
            <div className="text-center py-4">Loading exercises...</div>
          ) : exercises.length === 0 ? (
            <div className="text-center py-4">No exercises found. Create your first exercise!</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Training Session</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Sets</TableHead>
                  <TableHead>Repetitions</TableHead>
                  <TableHead>Weight (kg)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell>{getTrainingName(exercise.trainingId)}</TableCell>
                    <TableCell>{exercise.duration} min</TableCell>
                    <TableCell>{exercise.sets}</TableCell>
                    <TableCell>{exercise.repetitions}</TableCell>
                    <TableCell>{exercise.weight} kg</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(exercise)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(exercise.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExercisePage;
