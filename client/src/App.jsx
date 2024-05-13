import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import CreateList from './pages/CreateList';
import PrivateRoute from './components/PrivateRoute';
import List from './pages/List';
import UpdateList from './pages/UpdateList';


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route path='/list/:listId' element={<List />} />
        <Route element={<PrivateRoute />}>
          <Route path='/create-list' element={<CreateList />} />
          <Route path='/profile' element={<Profile />} />
          <Route
            path='/update-listing/:listingId'
            element={<UpdateList />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}