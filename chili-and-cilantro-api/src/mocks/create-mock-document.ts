import { mock, MockProxy } from 'jest-mock-extended';
import { Document, SaveOptions, Types } from 'mongoose';

export function convertDatesToISOStrings(obj: unknown): unknown {
  if (obj instanceof Date) {
    return obj.toISOString();
  } else if (Array.isArray(obj)) {
    return obj.map(convertDatesToISOStrings);
  } else if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce(
      (acc, key) => {
        acc[key] = convertDatesToISOStrings(
          (obj as Record<string, unknown>)[key],
        );
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }
  return obj;
}

export function createMockDocument<T extends Document>(
  initializer: () => Partial<T>,
): MockProxy<T> & T {
  const doc = mock<T>();
  const data = initializer();

  Object.assign(doc, data);

  (doc._id as unknown) = data._id || new Types.ObjectId();
  (doc.isNew as boolean) = false;

  // Mock toObject as a function
  (doc.toObject as jest.Mock) = jest.fn().mockImplementation(() => {
    const result = {
      ...data,
      _id: (doc._id as Types.ObjectId).toString(),
    } as Partial<T> & { [key: string]: unknown };

    return convertDatesToISOStrings(result);
  });

  // Mock save method to preserve current object's data and add _id if missing
  const saveMock = jest
    .fn<Promise<T>, [SaveOptions?]>()
    .mockImplementation(async () => {
      // Simulate adding _id if not present
      if (!doc._id) {
        (doc._id as unknown) = new Types.ObjectId();
      }
      return doc;
    });
  (doc.save as unknown) = saveMock;

  return doc;
}
