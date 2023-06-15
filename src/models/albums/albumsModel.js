const connexion = require('../../../db-config');
const db = connexion.promise();
const { deleteTracksByAlbumId } = require('../tracks/tracksModel');

const getAllAlbums = async () => {
  try {
    const albums = await db.query('SELECT * FROM albums');
    return albums[0];
  } catch (error) {
    throw new Error('Error retrieving albums');
  }
};

const getOneAlbums = async (id) => {
  try {
    const album = await db.query('SELECT * FROM albums WHERE id = ?', [id]);
    return album[0];
  } catch (error) {
    throw new Error('Error retrieving album');
  }
};

const getTracksFromIdAlbums = async (id) => {
  try {
    const tracks = await db.query('SELECT * FROM track WHERE id_album = ?', [
      id,
    ]);
    return tracks[0];
  } catch (error) {
    throw new Error('Error retrieving tracks from album');
  }
};

const createAlbum = async (album) => {
  const { title, genre = null, picture = null, artist = null } = album;

  const query =
    'INSERT INTO albums (title, genre, picture, artist) VALUES (?, ?, ?, ?)';

  const values = [title, genre, picture, artist];

  try {
    const albumResult = await db.query(query, values);
    return {
      id: albumResult[0].insertId,
      title,
      genre,
      picture,
      artist,
    };
  } catch (error) {
    throw new Error('Error creating album');
  }
};

// Mettre à jour un album spécifique (version avancée)
const updateAlbumById = async (id, album) => {
  const keys = Object.keys(album);
  const values = Object.values(album);

  let query = 'UPDATE albums SET ';
  const updateClauses = keys.map((key) => `${key} = ?`);
  query += updateClauses.join(', ');
  query += ' WHERE id = ?';

  values.push(id);

  try {
    await db.query(query, values);
    const updatedAlbum = await getOneAlbums(id);
    return updatedAlbum[0];
  } catch (error) {
    throw new Error('Error updating album');
  }
};

// Mettre à jour un album spécifique (version simple)
const updateAlbumByIdEasier = async (id, album) => {
  const keys = Object.keys(album);

  let query = 'UPDATE albums SET ';
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
    return getOneAlbums(id);
  } catch (error) {
    throw new Error('Error updating album');
  }
};

const deleteAlbumById = async (id) => {
  await deleteTracksByAlbumId(id);
  const query = 'DELETE FROM albums WHERE id = ?';
  try {
    const response = await db.query(query, [id]);
    if (response.affectedRows === 0) {
      throw new Error(`Album with ID ${id} not found`);
    }
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllAlbums,
  getOneAlbums,
  getTracksFromIdAlbums,
  createAlbum,
  updateAlbumById,
  updateAlbumByIdEasier,
  deleteAlbumById,
};
