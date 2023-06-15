const {
  getAllTracks,
  getOneTracks,
  createTrack,
  updateTrackById,
  deleteTrackById,
} = require('../../models/tracks/tracksModel');

const getAll = async (req, res) => {
  try {
    const tracks = await getAllTracks();
    if (tracks.length) {
      res.status(200).json(tracks);
    } else {
      res.status(404).json({ error: 'Not tracks found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const tracksById = await getOneTracks(id);
    if (tracksById.length === 0) {
      res.status(404).json({ error: 'Not found' });
    } else {
      res.status(200).json(tracksById[0]);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const postTracks = async (req, res) => {
  try {
    const trackCreated = await createTrack(req.body);
    if (!trackCreated.id) {
      res.status(500).send('Track not created');
    } else {
      res.status(201).send(trackCreated);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateTracks = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedTrack = await updateTrackById(id, updates);
    if (!updatedTrack) {
      res.status(404).send(`Track with ID ${id} not found`);
    } else {
      res.status(204).json(updatedTrack);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteTracks = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedTrack = await deleteTrackById(id);
    if (deletedTrack) {
      res.sendStatus(204);
    } else {
      res.status(404).send('Track not deleted');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { getOne, getAll, postTracks, updateTracks, deleteTracks };
