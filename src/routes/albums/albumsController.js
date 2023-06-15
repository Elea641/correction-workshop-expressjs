const {
  getAllAlbums,
  getOneAlbums,
  getTracksFromIdAlbums,
  createAlbum,
  updateAlbumById,
  deleteAlbumById,
} = require('../../models/albums/albumsModel');

const getAll = async (req, res) => {
  try {
    const albums = await getAllAlbums();
    if (albums.length === 0) {
      res.status(404).send('No albums found');
    } else {
      res.status(200).send(albums);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const albumsById = await getOneAlbums(id);
    if (albumsById.length === 0) {
      res.status(404).json({ error: 'Album not found' });
    } else {
      res.status(200).json(albumsById[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTracksByAlbumId = async (req, res) => {
  const { id } = req.params;
  try {
    const tracks = await getTracksFromIdAlbums(id);
    if (tracks.length === 0) {
      res.status(404).send(`No tracks found on album id ${id}`);
    } else {
      res.status(200).send(tracks);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const postAlbums = async (req, res) => {
  try {
    const albumCreated = await createAlbum(req.body);
    if (albumCreated.length === 0) {
      res.status(404).send('Album not created');
    } else {
      res.status(201).json(albumCreated);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateAlbums = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedAlbum = await updateAlbumById(id, updates);
    if (!updatedAlbum) {
      res.status(404).send('Album not updated');
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAlbums = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedAlbum = await deleteAlbumById(id);
    if (deletedAlbum.affectedRows === 0) {
      res.status(404).send('Album not deleted');
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};
