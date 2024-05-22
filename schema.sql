CREATE TABLE IF NOT EXISTS myAnimals (
  id SERIAL PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  family TEXT NOT NULL,
  place_of_found TEXT NOT NULL,
  specie TEXT NOT NULL,
  habits TEXT NOT NULL,
  diet TEXT NOT NULL,
  weight DECIMAL NOT NULL,
  height DECIMAL NOT NULL,
  image TEXT NOT NULL
);

