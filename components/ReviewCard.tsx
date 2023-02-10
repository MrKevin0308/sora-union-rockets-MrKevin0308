import { Button, Grid, Link, Typography } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { IReview } from "@/types";
import { useReviewStore } from "@/store/ReviewStore";
import Image from "next/image";
import { toast } from "react-toastify";

type Props = {
  cardData: IReview;
  editCard: () => void
};

export default function ReviewCard({ cardData, editCard }: Props) {
  const reviews = useReviewStore((state) => state.reviews);
  const updateReviews = useReviewStore((state) => state.updateReviews);

  // Delete Review
  const delCard = () => {
    if (confirm('You really want to remove this review?')) {
      const nList = reviews.filter((item) => item.id !== cardData.id);
      updateReviews(nList);
      toast.success('Successfully removed');
    }
  }

  return (
    <Grid
      container
      flexWrap="nowrap"
      gap={3}
      px={4}
      py={2}
      sx={{ backgroundColor: "white" }}
      borderRadius={4}
      boxShadow="2px 2px grey"
      position="relative"
    >
      {/* Edit & Del Btn */}
      <Grid position="absolute" right={6} top={6}>
        <Button color="success" sx={{ px: 0.5, minWidth: 0 }} onClick={editCard}>
          <Edit />
        </Button>
        <Button color="error" sx={{ px: 0.5, minWidth: 0 }} onClick={delCard}>
          <Delete />
        </Button>
      </Grid>
      {/* Rocket info */}
      <Grid direction="column" gap={2}>
        <Image src="/rocket.png" alt="Rocket Image" width={100} height={120} />
        <Typography fontWeight="bold" textAlign="center">{cardData.rocketName}</Typography>
      </Grid>
      {/* Review info */}
      <Grid direction="column" display="flex" gap={1} flexGrow={1}>
        <Typography variant="h6">{cardData.title}</Typography>
        <Typography flexGrow={1} sx={{ whiteSpace: 'pre' }}>{cardData.description}</Typography>
        <Link href={`https://github.com/${cardData.gitUser.login}`} target="_blank" underline="hover">
          <Grid container alignItems="center" gap={1} mt={2} sx={{ cursor: 'pointer' }}>
            <div style={{borderRadius: '50%', width: 32, height: 32, overflow: 'hidden'}}>
              <Image
                src={cardData.gitUser.avatar_url}
                alt={cardData.gitUser.login}
                width={32}
                height={32}
              />
            </div>
            <Typography>{cardData.gitUser.login}</Typography>
          </Grid>
        </Link>
      </Grid>
    </Grid>
  );
}
