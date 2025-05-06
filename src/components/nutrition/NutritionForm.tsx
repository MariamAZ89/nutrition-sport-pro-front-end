
import React, { useState, useEffect } from "react";
import { Nutrition, NutritionFormData } from "../../types/nutrition";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "../ui/form";

interface NutritionFormProps {
  nutrition?: Nutrition;
  onSubmit: (data: NutritionFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const NutritionForm: React.FC<NutritionFormProps> = ({ 
  nutrition, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}) => {
  const isEditMode = !!nutrition;
  
  const form = useForm<NutritionFormData>({
    defaultValues: {
      Calories: nutrition?.calories || 0,
      Protein: nutrition?.protein || 0,
      Carbohydrates: nutrition?.carbohydrates || 0,
      Lipids: nutrition?.lipids || 0,
      Food: nutrition?.food || "",
      Notes: nutrition?.notes || "",
      Date: nutrition?.date ? new Date(nutrition.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    },
  });

  const handleSubmit = (data: NutritionFormData) => {
    // Format date with time
    const date = new Date(data.Date);
    const formattedData = {
      ...data,
      Date: date.toISOString()
    };
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="Food"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Food</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Chicken Salad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="Date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="Calories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calories</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="Protein"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Protein (g)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="Carbohydrates"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carbohydrates (g)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="Lipids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lipids (g)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="Notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes about this meal..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NutritionForm;
