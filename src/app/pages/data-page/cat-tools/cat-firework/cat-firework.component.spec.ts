import { TestBed } from '@angular/core/testing';

import { CatFireworkComponent } from './cat-firework.component';

describe('CatFireworkComponent', () => {
  it('renders a twelve-particle decorative burst', async () => {
    await TestBed.configureTestingModule({
      imports: [CatFireworkComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(CatFireworkComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.cat-firework__particle')).toHaveSize(12);
    expect(element.querySelector('.cat-firework__core')).not.toBeNull();
  });
});
