
import React from "react";
import { Nutrition } from "../../types/nutrition";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface NutritionTableProps {
  nutritionRecords: Nutrition[];
  onEdit: (nutrition: Nutrition) => void;
  onDelete: (id: string) => void;
}

const NutritionTable: React.FC<NutritionTableProps> = ({ nutritionRecords, onEdit, onDelete }) => {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Food</TableHead>
            <TableHead>Calories</TableHead>
            <TableHead>Protein (g)</TableHead>
            <TableHead>Carbs (g)</TableHead>
            <TableHead>Lipids (g)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nutritionRecords.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No nutrition records found
              </TableCell>
            </TableRow>
          ) : (
            nutritionRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                <TableCell>{record.food}</TableCell>
                <TableCell>{record.calories}</TableCell>
                <TableCell>{record.protein}</TableCell>
                <TableCell>{record.carbohydrates}</TableCell>
                <TableCell>{record.lipids}</TableCell>
                <TableCell className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(record)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => onDelete(record.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default NutritionTable;
