import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProfileInfo from '@profile/presentational/ProfileInfo';
import FeedList from '@feedExplore/presentational/FeedList';
import pathURL from '@constants/path';
// import dummy from '@feedExplore/dummy';

const style = {};

style.ProfileContainer = styled.div``;

const ProfileContainer = () => {
  const userName = 'rlaqudrnr810';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getData = () => {
    const url = pathURL.IP + pathURL.API_PROFILE + userName;
    const option = {
      mode: 'cors',
      method: 'GET',
    };
    async function fetchUrl() {
      const response = await fetch(url, option);
      const json = await response.json();
      setData(json);
      setLoading(true);
    }
    useEffect(() => {
      fetchUrl();
    }, []);
  };
  getData();
  if (loading) {
    return (
      <style.ProfileContainer>
        <ProfileInfo data={data} />
        <FeedList datas={data.feeds} />
      </style.ProfileContainer>
    );
  }
  return <>loading...</>;
};

export default ProfileContainer;
