import { useState, useEffect } from 'react';
import { Container } from './App.styled';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';
import { fetchPixabay } from 'services/pixabay-api';
import { Circles } from 'react-loader-spinner';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loadedImages, setLoadedImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageInModal, setImageInModal] = useState({ link: '', alt: '' });
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const showNotification = data => {
      if (page === 1) {
        data.hits.length > 0
          ? toast.success(`Wow! We found ${data.total} results`)
          : toast.warn(`Sorry, but there are no results for your query`);
      }
    };

    if (searchQuery !== '') {
      try {
        setIsLoading(true);

        fetchPixabay(searchQuery, page).then(data => {
          setLoadedImages(prev => [...prev, ...data.hits]);
          showNotification(data);
          setTotalPages(Math.floor(data.totalHits / 12));
          setIsLoading(false);
        });
      } catch (error) {
        toast.error('Ooops, something went wrong :(');
        console.log(error);
      }
    }
  }, [page, searchQuery]);

  const handleFormSubmit = inputValue => {
    if (searchQuery !== inputValue) {
      setSearchQuery(inputValue);
      setLoadedImages([]);
      setPage(1);
    }
  };

  const handleLoadMoreClick = () => {
    setPage(prev => prev + 1);
  };

  const handleImageClick = image => {
    const { largeImageURL, tags } = image;

    setIsLoading(true);
    setIsModalOpen(true);
    setImageInModal({ link: largeImageURL, alt: tags });
  };

  const handleModalImageLoaded = () => {
    setIsLoading(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleFormSubmit} />

      <ImageGallery
        loadedImages={loadedImages}
        onClick={handleImageClick}
      ></ImageGallery>

      {isLoading && (
        <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{
            display: 'block',
            margin: '0 auto ',
          }}
          wrapperClass=""
          visible={true}
        />
      )}

      {loadedImages.length > 0 && !isLoading && page <= totalPages && (
        <Button text="Load more" onClick={handleLoadMoreClick}></Button>
      )}

      {isModalOpen && (
        <Modal
          image={imageInModal}
          onClose={handleModalClose}
          onLoad={handleModalImageLoaded}
        ></Modal>
      )}

      <ToastContainer />
    </Container>
  );
};