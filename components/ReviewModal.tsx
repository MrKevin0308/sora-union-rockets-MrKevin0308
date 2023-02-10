import { useState, useCallback, useEffect } from "react";
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { RocketLaunch } from "@mui/icons-material";
import { IReview, IGitUser } from '@/types';
import { useReviewStore } from "@/store/ReviewStore";
import { debounce } from '@mui/material/utils';
import { Octokit } from "octokit";
import Image from "next/image";
import { toast } from 'react-toastify';

type Props = {
  modalIsOpen: boolean,
  closeModal: () => void,
  data: IReview
}

export default function ReviewModal({ modalIsOpen, closeModal, data }: Props) {
  const reviews = useReviewStore((state) => state.reviews);
  const updateReviews = useReviewStore((state) => state.updateReviews);
  const [modalData, setModalData] = useState<IReview>(data);
  const [gitUsers, setGitUsers] = useState<IGitUser[]>([]);
  const [inputValue, setInputValue] = useState<string>(data.gitUser.login);

  // When modal is open/closed, reset modal form data
  useEffect(() => {
    setModalData(data);
  }, [modalIsOpen]);

  // Save form data to zustand store and localStorage
  const saveModal = () => {
    // Check Validation
    if (!modalData.title || !modalData.rocketName || !modalData.description || !modalData.gitUser.login) {
      toast.error('Please enter all info of review...');
      return;
    }

    let nReviews = reviews;
    if (modalData.id > -1) {
      // Update existing
      const fIndex = nReviews.findIndex((item) => item.id === modalData.id);
      nReviews[fIndex] = modalData;
    } else {
      // Add new
      modalData.id = Math.round(Math.random() * 100000);
      nReviews.unshift(modalData);
    }
    
    // Save data
    updateReviews([...nReviews]);
    console.log(nReviews, 'reviews');
    toast.success(`Saved review - '${modalData.title}'...`);
    closeModal();
  }

  // Get github users asynchronously
  const getGithubUsers = async (newInputValue: string) => {
    if (!newInputValue) {
      setGitUsers([]);
      return;
    }
    try {
      const octokit = new Octokit({
        auth: process.env.NEXT_PUBLIC_GITHUB_AUTH_TOKEN
      });
      const res = await octokit.request('GET /search/users', {
        q: newInputValue
      });
      if (res.status !== 200) {
        throw Error('Failed to get github users...');
      }
      setGitUsers([...res.data.items])
      console.log(gitUsers, 'users');
    } catch(e: any) {
      console.log(e, 'e');
      toast.error(e.message ?? 'Something went wrong');
    }
  };

  // Debounce getGithubUsers()
  const debouncedChangeHandler = useCallback(
    debounce(getGithubUsers, 300)
  , []);

  return (
    <Dialog open={modalIsOpen} onClose={closeModal} fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {modalData.id > -1 ? 'Edit' : 'New'} Rocket
        <RocketLaunch />
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          required
          id="title"
          label="Title"
          fullWidth
          value={modalData.title}
          onChange={(e) => setModalData({...modalData, title: e.target.value})}
        />
        <TextField
          autoFocus
          margin="dense"
          required
          id="rocketName"
          label="Rocket Name"
          fullWidth
          value={modalData.rocketName}
          onChange={(e) => setModalData({...modalData, rocketName: e.target.value})}
        />
        <TextField
          autoFocus
          margin="dense"
          required
          multiline
          rows={3}
          id="description"
          label="Description"
          fullWidth
          value={modalData.description}
          onChange={(e) => setModalData({...modalData, description: e.target.value})}
        />
        <Autocomplete
          value={modalData.gitUser}
          id="github-user"
          options={gitUsers}
          sx={{ mt: 1 }}
          fullWidth
          inputValue={inputValue}
          renderInput={(params) => <TextField {...params} label="Github User" required />}
          getOptionLabel={(option) => option.login }
          isOptionEqualToValue={(option, value) => option.login === value.login}
          renderOption={(props, option) => {
            return (
              <li {...props}>
                <Grid container direction="row" alignItems="center" gap={3}>
                  <Image
                    src={option.avatar_url}
                    alt={option.login}
                    width={32}
                    height={32}
                  />
                  <Typography variant="h5" flexGrow={1}>
                    {option.login}
                  </Typography>
                </Grid>
              </li>
            )
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            debouncedChangeHandler(newInputValue);
          }}
          onChange={(event, newValue) => {
            if (newValue) setModalData({...modalData, gitUser: newValue})
          }}
        />
        <DialogActions sx={{ mt: 1 }}>
          <Button variant="outlined" onClick={closeModal}>Cancel</Button>
          <Button variant="contained" onClick={saveModal}>Save</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}