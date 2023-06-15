const connexion = require('../../../db-config');
const db = connexion.promise();

const getAllTracks = async () => {
  try {
    const tracks = await db.query('SELECT * FROM track');
    return tracks[0];
  } catch (error) {
    throw new Error('Error retrieving tracks');
  }
};

const getOneTracks = async (id) => {
  try {
    const track = await db.query('SELECT * FROM track WHERE id = ?', [id]);
    return track[0];
  } catch (error) {
    throw new Error('Error retrieving user');
  }
};

const deleteTracksByAlbumId = async (id) => {
  const query = 'DELETE FROM track WHERE id_album = ?';
  try {
    await db.query(query, [id]);
  } catch (error) {
    throw new Error(error.message);
  }
};

const createTrack = async (track) => {
  const { title, youtube_url = null, id_album } = track;

  const query =
    'INSERT INTO track (title, youtube_url, id_album) VALUES (?, ?, ?)';

  const values = [title, youtube_url, id_album];

  try {
    const trackResult = await db.query(query, values);
    return {
      id: trackResult[0].insertId,
      title,
      youtube_url,
      id_album,
    };
  } catch (error) {
    throw new Error('Error creating album');
  }
};

// Mettre à jour une track spécifique (version avancée)
const updateTrackById = async (id, track) => {
  // on récupère les clés des champs à modifier
  const keys = Object.keys(track);
  // on récupère les valeurs des champs à modifier
  const values = Object.values(track);

  // on crée la requete
  let query = 'UPDATE track SET ';
  // on implémente la requête en fonction des clés
  const updateClauses = keys.map((key) => `${key} = ?`);
  // on concatène
  query += updateClauses.join(', ');
  // on fini avec l'id de la track à modifier
  query += ' WHERE id = ?';

  // on ajoute l'id de la track à modifier dans nos valeurs
  values.push(id);

  try {
    await db.query(query, values);
    return getOneTracks(id);
  } catch (error) {
    throw new Error('Error updating track');
  }
};

// Mettre à jour un track spécifique (version simple)
const updateTrackByIdEasier = async (id, album) => {
  const keys = Object.keys(album);

  let query = 'UPDATE track SET ';
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    query += `${key} = "${album[key]}"`;
    if (i !== keys.length - 1) {
      query += ', ';
    }
  }
  query += ` WHERE id = ${id}`;

  try {
    await db.query(query);
    return getOneTracks(id);
  } catch (error) {
    throw new Error('Error updating track');
  }
};

const deleteTrackById = async (id) => {
  const query = 'DELETE FROM track WHERE id = ?';
  try {
    const response = await db.query(query, [id]);
    if (response.affectedRows === 0) {
      return null;
    }
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllTracks,
  deleteTracksByAlbumId,
  getOneTracks,
  createTrack,
  updateTrackById,
  updateTrackByIdEasier,
  deleteTrackById,
};
