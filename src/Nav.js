import React from 'react'
import './Nav.css'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function Nav() {

  const [show, handleShow] = useState(false);
  const navigate = useNavigate()

  const goToProfile = () => {
    navigate('/profile');
  }

  const goToHome = () => {
    navigate('/');
  }

  const transitionNavBar = () => {
    if(window.scrollY > 100) {
      handleShow(true)
    } else {
      handleShow(false)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", transitionNavBar);

    return () => {
      window.removeEventListener("scroll", transitionNavBar)
    }
  }, [])



  return (
    <div className={`nav ${ show  && "nav__black"}`}>
      <div className="nav__contents">
      <img
        onClick={goToHome}
        className='nav__logo'
        src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
        alt=""
      />

      <img
        onClick={goToProfile}
        className='nav__avatar'
        src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR_y7esQ_vTyh7TfYxNR8noYB5rFWHqqCjJIIYmWQsaMrpMTTvb" alt=""
      />

      </div>

    </div>
  )
}

export default Nav
