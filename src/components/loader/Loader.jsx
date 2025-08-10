import React from 'react';

const Loader = ({ background, height, width, screen }) => {
  return (
    <>
      {screen !== undefined && screen === 'full' ? (
        <div
          className={`  fixed inset-0 flex items-center justify-center z-[999] ${background === 'none' ? '' : ''
            }`}
        >
          <div className="flex items-center justify-center p-5 w-24 h-24 bg-gray-700/80 rounded-md">
            <div className="relative w-12 h-12">
              {/* Outer rotating ring */}
              <span className="absolute inset-0 w-full h-full border-t-4 border-r-4 border-white border-transparent rounded-full animate-rotation"></span>
              {/* Inner counter-rotating ring */}
              <span className="absolute inset-0 w-8 h-8 border-l-4 border-b-4 primaryColorBorder rounded-full animate-reverseRotation top-2 left-2"></span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`flex items-center justify-center ${background ? '' : 'bg-gray-100'
            }`}
          style={{
            width: width,
            height: height,
            background: background || 'transparent',
          }}
        >
          <div className="flex items-center justify-center p-5 w-24 h-24 bg-gray-700/80 rounded-md">
            <div className="relative w-12 h-12">
              {/* Outer rotating ring (white) */}
              <span className="absolute inset-0 w-full h-full border-t-4 border-r-4 border-white rounded-full animate-rotation"></span>

              {/* Inner counter-rotating ring (black) */}
              <span className="absolute inset-0 w-8 h-8 border-l-4 border-b-4 primaryColorBorder rounded-full animate-reverseRotation top-2 left-2"></span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default Loader;
