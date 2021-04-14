import parse from 'csv-parse';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const processFile = async () => {
  const parser = fs.createReadStream(`${__dirname}/Pcd_010421.csv`).pipe(parse({
    delimiter: ';'
  }));

  const map = new Map();

  for await (const [postcode, gss] of parser) {
    const area = postcode.split(' ')[0];
    
    if (map.has(area)) {
      if (!map.get(area) === gss) {
        console.log(`Area ${area} maps to GSS ${map.get(area)} and ${gss}`);
      }
    }
    else {
      map.set(area, gss);
    }
  }

  fs.writeFileSync(`${__dirname}/output.csv`, Array.from(map.entries()).map(([area, gss]) => `${area},${gss}\n`).join(''), {encoding: 'utf8'});
}

processFile();
