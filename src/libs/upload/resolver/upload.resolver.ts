import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UploadEntity } from 'src/entities/psql/UploadEntity';
import { UploadGqlFileArgInput, UploadMultipleGqlFileArgInput } from '../dto/args/upload.gql.arg.input';
import { UploadService } from '../service/upload.service';

@Resolver()
export class UploadResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: UploadService,
    ) { }

    @Mutation(() => UploadEntity, {
        name: 'uploadFile',
    })
    public async uploadFile(
        @Args('data')
        { file }: UploadGqlFileArgInput,
    ): Promise<UploadEntity> {
        return this._service.saveFromGraphqlUpload(file);
    }

    @Mutation(() => UploadEntity, {
        name: 'uploadFiles',
    })
    public async uploadFiles(
        @Args('data')
        { files }: UploadMultipleGqlFileArgInput,
    ): Promise<UploadEntity[]> {
        return this._service.saveFromGraphqlUploadMultiple(files);
    }
}