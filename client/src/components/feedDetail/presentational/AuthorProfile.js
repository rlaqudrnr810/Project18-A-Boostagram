import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import UserContext from '@context/user';
import theme from '@style/Theme';
import pathURI from '@constants/path';
import { Link } from 'react-router-dom';

const style = {};

style.AuthorProfile = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.color.border};
  align-items: center;
`;

style.ProfileImg = styled.img`
  width: 30px;
  height: 30px;
  margin: 20px 14px 20px 20px;
  border-radius: 15px;
  overflow: hidden;
`;

style.AuthorName = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

style.Divider = styled.div`
  margin: 0 6px;
`;

style.FollowBtn = styled.div`
  background-color: #0095f6;
  border: none;
  border-radius: 3px;
  color: white;
  font-weight: bold;
  padding: 4px 20px;
  cursor: pointer;
`;

style.UnfollowBtn = styled.div`
  background-color: transparent;
  border: 1px solid ${theme.color.border};
  border-radius: 3px;
  font-weight: bold;
  padding: 4px 20px;
  cursor: pointer;
`;

style.Link = styled(Link)`
  text-decoration: none;
  color: #262626;
`;

const AuthorProfile = ({ author }) => {
  const { userName, profileImg } = author;

  const { login, setLogin } = useContext(UserContext);

  const checkFollowing = () => {
    const result = login.follow?.find((f) => f.userName === userName);
    return result !== undefined;
  };

  const [followStatus, setFollowState] = useState(checkFollowing());
  useEffect(() => {
    setFollowState(checkFollowing());
  }, [userName, login]);

  const clickHandler = () => {
    const followData = {
      author: {
        name: login.name,
        userName: login.userName,
        profileImg: login.profileImg,
      },
      status: followStatus ? 0 : 1,
    };
    fetch(pathURI.IP + pathURI.API_FOLLOW + userName, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.jwt}`,
      },
      body: JSON.stringify(followData),
    }).then(() => {
      if (followStatus) {
        const newFollow = login.follow.filter(
          (ele) => ele.userName !== userName,
        );
        setLogin({ ...login, follow: newFollow });
      } else {
        const newFollow = login.follow;
        newFollow.push({ userName, profileImg });
        setLogin({ ...login, follow: newFollow });
      }

      setFollowState(!followStatus);
    });
  };

  const FollowOrUnfollow = followStatus ? (
    <style.UnfollowBtn onClick={clickHandler}>언팔로우</style.UnfollowBtn>
  ) : (
    <style.FollowBtn onClick={clickHandler}>팔로우</style.FollowBtn>
  );
  const userProfileURL = `/profile?userName=${userName}`;
  return (
    <style.AuthorProfile>
      <Link to={userProfileURL}>
        <style.ProfileImg src={profileImg} />
      </Link>
      <style.Link to={userProfileURL}>
        <style.AuthorName>{userName}</style.AuthorName>
      </style.Link>
      {login.userName !== userName ? (
        <>
          <style.Divider>•</style.Divider>
          {FollowOrUnfollow}
        </>
      ) : (
        <></>
      )}
    </style.AuthorProfile>
  );
};

export default AuthorProfile;
