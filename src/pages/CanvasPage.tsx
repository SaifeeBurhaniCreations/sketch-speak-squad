
import { useState } from "react";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CanvasPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-game-softBlue to-game-lightBlue p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="outline" className="bg-white text-game-blue">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Game
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Canvas Testing Page</h1>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-game-blue">Drawing Canvas</h2>
          <p className="mb-4 text-gray-700">This is a standalone page for testing the drawing canvas functionality.</p>
          
          <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
            <DrawingCanvas isDrawer={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasPage;
