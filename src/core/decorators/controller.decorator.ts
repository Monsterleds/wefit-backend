import { MetadataKeys } from '../enums/metadata.keys';

const Controller = (prefix: string): ClassDecorator => {
    return (target) => {
        Reflect.defineMetadata(MetadataKeys.PREFIX, prefix, target);
    };
}
export default Controller;