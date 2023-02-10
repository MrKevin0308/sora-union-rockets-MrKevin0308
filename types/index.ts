export type IGitUser = {
  avatar_url: string;
  login: string;
}

export type IReview = {
  id: number;
  title: string;
  rocketName: string;
  description: string;
  gitUser: IGitUser;
}
