import Head from "next/head";
import { Button, Grid } from "@mui/material";
import { Container } from "@mui/system";
import { RocketLaunch, Add } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { IReview } from "@/types";
import { useReviewStore } from "@/store/ReviewStore";
import ReviewModal from "@/components/ReviewModal";
import ReviewCard from "@/components/ReviewCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Init Review data for modal
const initModalData: IReview = {
  id: -1,
  title: "",
  rocketName: "",
  description: "",
  gitUser: {
    login: "",
    avatar_url: "",
  },
};

export default function Home() {
  const reviews = useReviewStore((state) => state.reviews);
  const updateReviews = useReviewStore((state) => state.updateReviews);
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<IReview>(initModalData);

  // Get review data from localStorage at first
  useEffect(() => {
    const sList = localStorage.getItem(
      process.env.NEXT_PUBLIC_STORAGE_KEY ?? "sora-union-bluesky"
    );
    if (sList) {
      updateReviews(JSON.parse(sList));
    }
  }, []);

  const openModal = (data?: IReview) => {
    setModalData(data ?? initModalData);
    setIsOpen(true);
  };

  const editCard = (review: IReview) => {
    openModal(review);
  }

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Head>
        <title>Sora Union</title>
        <meta name="description" content="List of Rockets" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container maxWidth="sm" sx={{ height: "100vh", py: 4 }}>
          <Grid container direction="row" alignItems="center" gap={2}>
            <RocketLaunch />
            <Typography variant="h5" flexGrow={1}>
              List of Rockets
            </Typography>
            <Button onClick={() => openModal()}>
              <Add />
            </Button>
          </Grid>
          <Grid container direction="column" gap={4} py={4}>
            {reviews.map((review) => (
              <ReviewCard cardData={review} editCard={() =>editCard(review)} key={review.id} />
            ))}
            {reviews.length === 0 && (
              <Typography textAlign="center">No Reviews yet... :(</Typography>
            )}
          </Grid>
        </Container>

        {/* Review Modal */}
        <ReviewModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          data={modalData}
        />

        <ToastContainer />
      </main>
    </>
  );
}
