import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Character } from 'src/app/core/models/character';
import { Specie } from 'src/app/core/models/specie';

import { CharacterService } from 'src/app/core/services/character.service';
import { LoaderService } from 'src/app/core/services/loader.service'
import { SpecieService } from 'src/app/core/services/specie.service';
;
import { SpecieModalComponent } from '../../components/specie-modal/specie-modal.component';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css']
})
export class CharacterDetailsComponent implements OnInit {

  @ViewChild('specieModal') specieModal: SpecieModalComponent;

  id: string;
  character: Character;

  constructor(
    private activatedRoute: ActivatedRoute,
    private characterService: CharacterService,
    private specieService: SpecieService,
    private loaderService: LoaderService
  ) { }

  getSpecieIdFromUrl(url: string) {
    return url.split('/')[5];
  }

  async getSpeciesFromUrls(urls: string[]) {
    const promiseArray = [];
    urls.forEach(url => {
      promiseArray.push(this.specieService.getSpecieById(this.getSpecieIdFromUrl(url)).toPromise());
    });
    return await Promise.all(promiseArray);
  }

  async getCharacterWithSpecies(id: string) {
    let character: Character;
    character = await this.characterService.getCharacterById(id).toPromise();
    character.species = await this.getSpeciesFromUrls(character.species);
    return character;
  }

  getCharacter(id: string) {
    this.loaderService.show();
    this.getCharacterWithSpecies(id)
    .then(character => {
      this.character = character;
      this.loaderService.hide();
    })
    .catch(error => {
      console.error(error);
      this.loaderService.hide();
    });
  }

  openSpecieModal(specie: Specie) {
    this.specieModal.open(specie);
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getCharacter(this.id);
  }

}
