import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import { exerciseOptions, fetchData, youtubeOptions, EXERCISE_DB_BASE_URL, YOUTUBE_SEARCH_BASE_URL } from "../utils/fetchData";
import Detail from "../components/Detail";
import ExerciseVideos from "../components/ExerciseVideos";
import SimilarExercises from "../components/SimilarExercises";

const ExerciseDetail = () => {
  const [exerciseDetail, setExerciseDetail] = useState({});
  const [exerciseVideos, setExerciseVideos] = useState([]);
  const [targetMuscleExercises, setTargetMuscleExercises] = useState([]);
  const [equipmentExercises, setEquipmentExercises] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchExercisesData = async () => {
      try {
        const exerciseDetailData = await fetchData(
          `${EXERCISE_DB_BASE_URL}/exercises/exercise/${id}`,
          exerciseOptions
        );
        setExerciseDetail(exerciseDetailData);

        const exerciseVideosData = await fetchData(
          `${YOUTUBE_SEARCH_BASE_URL}/search?query=${exerciseDetailData.name} exercise`,
          youtubeOptions
        );
        setExerciseVideos(exerciseVideosData.contents);

        const targetMuscleExercisesData = await fetchData(
          `${EXERCISE_DB_BASE_URL}/exercises/target/${exerciseDetailData.target}`,
          exerciseOptions
        );
        setTargetMuscleExercises(targetMuscleExercisesData);

        const equimentExercisesData = await fetchData(
          `${EXERCISE_DB_BASE_URL}/exercises/equipment/${exerciseDetailData.equipment}`,
          exerciseOptions
        );
        setEquipmentExercises(equimentExercisesData);
        setError(null);
      } catch (err) {
        setError("Failed to load exercise details. Please try again later.");
        console.error("Error fetching exercise details:", err);
      }
    };

    fetchExercisesData();
  }, [id]);

  if (error) {
    return (
      <Box sx={{ mt: { lg: "96px", xs: "60px" }, p: "20px" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!exerciseDetail) return <div>No Data</div>;

  return (
    <Box sx={{ mt: { lg: "96px", xs: "60px" } }}>
      <Detail exerciseDetail={exerciseDetail} />
      <ExerciseVideos
        exerciseVideos={exerciseVideos}
        name={exerciseDetail.name}
      />
      <SimilarExercises
        targetMuscleExercises={targetMuscleExercises}
        equipmentExercises={equipmentExercises}
      />
    </Box>
  );
};

export default ExerciseDetail;
