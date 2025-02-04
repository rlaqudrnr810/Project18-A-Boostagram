import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const style = {};
style.NavBar = styled.ul`
  position: absolute;
  bottom: 5px;
  display: flex;
  width: 90%;
  list-style-type: none;
  overflow: hidden;
`;
style.NavItem = styled.li`
  background-color: ${({ active, theme }) =>
    active ? 'white' : theme.color.border};
  width: 6px;
  height: 6px;
  border-radius: 6px;
  & + & {
    margin-left: 5px;
  }
`;

const ImgNav = (props) => {
  const { imgIndex, imgs } = props;
  return (
    <style.NavBar>
      {imgs.length > 1 &&
        imgs.map((img, index) => {
          const key = img + index;
          return imgIndex === index ? (
            <style.NavItem key={key} active />
          ) : (
            <style.NavItem key={key} />
          );
        })}
    </style.NavBar>
  );
};

ImgNav.propTypes = {
  imgIndex: PropTypes.number.isRequired,
  imgs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ImgNav;
