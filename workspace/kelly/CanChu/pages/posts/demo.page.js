import React from 'react';
import Post from '../Post/post';
import MockData from '../Post/components/mockData';
import Header from '../components/Header';

export default function Demo() {
  return (
    <div>
      <Header />
      <Post data={MockData[0]} showComments={true} showImage={true} />
    </div>
  );
}
