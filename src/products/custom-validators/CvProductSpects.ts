import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'CvProductSpecs',
  async: false,
})
export class CvProductSpecs implements ValidatorConstraintInterface {
  acceptedSpecs = ['color', 'brand'];

  validate(specs: Record<string, string>): boolean {
    const keys = Object.keys(specs);

    if (keys.length === 0) return true;

    return keys.every(
      (key) =>
        this.acceptedSpecs.includes(key) &&
        typeof specs[key] === 'string' &&
        specs[key].trim() !== '',
    );
  }
}
