'use client';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacetsLogoWithText from '../components/FacetsLogoWithText';
import moment from 'moment';
import Water from '../components/Water';
import Mood, { moodEmojis } from '../components/Mood';
import { useAuthState } from '../components/authState';
import { User } from '@prisma/client';
import Modal from '../components/Modal';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { authState } = useAuthState();
  const [modalOpen, setModalOpen] = useState(false);
  const displayDate = moment().format('dddd, MMMM Do, YYYY');
  const date = moment().format('YYYYMMDD');
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const [water, setWater] = useState<number>(0);
  const [mood, setMood] = useState<number>(0);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'same-origin',
          mode: 'same-origin',
        });
        const res = await response.json();
        console.log('user', res);
        setUser(res);
      } catch (error: unknown) {
        console.error(error);
      }
    };
    if (authState.isAuthenticated) {
      console.log('getUserProfile');
      getUserProfile();
    } else {
      //   navigate('/');
    }
  }, [setUser]);

  useEffect(() => {
    const getDateData = async () => {
      try {
        const queryParams = new URLSearchParams({
          date,
          timezone,
        });
        const response = await fetch(`/api/datedata/?${queryParams}`, {
          credentials: 'same-origin',
          mode: 'same-origin',
        });

        if (!response.ok) {
          console.error('response not ok', response);
        }

        const data = await response.json();
        console.log('getData', data);
        if (data.water) setWater(data.water);
        if (data.mood) setMood(data.mood);
        // Process the data
      } catch (error) {
        console.error('Fetch error: ' + (error as Error).message);
        // Handle the fetch error
      }
    };

    if (user?.id) {
      console.log('getDateData');
      getDateData();
    }
  }, [user]);

  useEffect(() => {
    const body = JSON.stringify({
      date,
      timezone,
      userId: user?.id,
      water,
      mood,
    });
    console.log('body', body);
    const updateDateData = async () => {
      try {
        if (user?.id) {
          const response = await fetch('/api/datedata/', {
            method: 'POST',
            credentials: 'same-origin',
            mode: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
            },
            body: body,
          });
          console.log('updateDateData response', response);
        }
      } catch (error: unknown) {
        console.error(error);
      }
    };

    if (user?.id) {
      console.log('updateDateData');
      updateDateData();
    }
  }, [user, water, mood]);

  return (
    <>
      <div className="bg-gradient"></div>
      <Modal open={modalOpen} />
      <div
        className="flex flex-row min-h-screen"
        style={{ paddingBottom: 150 }}
      >
        <div className="max-w-screen-md mx-auto w-full">
          <div className="flex justify-center mt-10">
            <FacetsLogoWithText width={50} />
          </div>
          <div
            className="flex justify-center mt-5 mb-5 rounded-full mx-auto"
            style={{ width: 100, height: 100, backgroundColor: '#333' }}
          >
            <img
              className="not-prose"
              style={{ borderRadius: '50%' }}
              width={100}
              height={100}
              src="https://media.licdn.com/dms/image/C5603AQEMItwK7rS6vw/profile-displayphoto-shrink_400_400/0/1611383726778?e=1703721600&v=beta&t=LEMA3XTJn7uM0VNCjlMWNvb6LUUBQAdQxjVDR6Mxgkk"
              alt="profile image"
            />
          </div>
          <div className="text-white text-lg text-center mt-[-40px] prose">
            <span className="text-3xl">
              {moodEmojis[mood - 1] ? moodEmojis[mood - 1] : '😃'}
            </span>
            <h4 className=" text-white">Hi {authState.name}!</h4>
            <div className="text-sm pb-[20px]">{displayDate}</div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="flex">
                <div className="pt-[15px] pr-1">Water: </div>
                <Water cups={8} water={water} setWater={setWater} />
              </div>
              <div className="flex pt-3">
                <div className="pt-[5px] pr-2">Happiness: </div>
                <Mood mood={mood} setMood={setMood} />
              </div>
            </div>
          </div>

          <h4 className="py-[40px] text-white text-lg text-center prose">
            What would you like to do today?
          </h4>
          <div className="flex flex-row flex-wrap justify-evenly">
            <button
              className="card w-[220px] h-[210px] bg-base-100 shadow-xl text-black mb-[10px]"
              onClick={() => navigate('/feelings')}
            >
              <div className="card-body">
                <h4 className="card-title">Identify Your Feelings</h4>
                <p className="text-xs text-left">
                  Having strong emotions or no emotions at all? Get in touch
                  with your feelings through this journaling activity.
                </p>
              </div>
            </button>
            <button
              className="card w-[220px] h-[210px] bg-base-100 shadow-xl text-black mb-[10px]"
              onClick={() => navigate('/goals')}
            >
              <div className="card-body">
                <h4 className="card-title">Identify Your Goals</h4>
                <p className="text-xs text-left">
                  Identifying your goals is about creating a vision for what you
                  want and providing yourself with a clear method to realize
                  that vision.
                </p>
              </div>
            </button>
            <button
              className="card w-[220px] h-[210px] bg-base-100 shadow-xl text-black mb-[10px]"
              onClick={() => navigate('/values')}
            >
              <div className="card-body">
                <h4 className="card-title">Identify Your Values</h4>
                <p className="text-xs text-left">
                  Values evolve with experience, so it&rsquo;s good to revisit
                  your values periodically.
                </p>
              </div>
            </button>
            <button
              className="card w-[220px] h-[210px] bg-base-100 shadow-xl text-black mb-[10px]"
              onClick={() => navigate('/journal')}
            >
              <div className="card-body">
                <h4 className="card-title">Journal</h4>
                <p className="text-xs text-left">
                  Blank slate to write about anything you want.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
