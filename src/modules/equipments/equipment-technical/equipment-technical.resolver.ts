import {
    Args,
    Context,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { EquipmentTechnicalService } from './equipment-technical.service';
import { UpdateEquipmentTechnicalInput } from './dtos/update-equipment-technical.input';
import { EquipmentTechnicalGenre } from '@/entities/psql/equipment-technical-genre.entity';
import { EquipmentTechnical } from '../../../entities/psql/equipment-technical.entity';

//Librairies
import Dataloader from 'dataloader';
import { EquipmentTechnicalThumbnail } from '@/entities/psql/equipment-technical-thumbnail.entity';
import { Good } from '@Entities/good.entity';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';

@Resolver((of) => EquipmentTechnical)
export class EquipmentTechnicalResolver {
    constructor(private equipmentTechnicalService: EquipmentTechnicalService) {}

    @Query((returns) => EquipmentTechnicalGenre, {
        name: 'findEquipmentTechnicalByEquipmentPark',
    })
    async findOne(
        @Args('equipmentPark') equipmentPark: number,
    ): Promise<EquipmentTechnical> {
        return this.equipmentTechnicalService.find(equipmentPark);
    }

    @ResolveField('equipmentPark', (returns) => EquipmentTechnicalGenre)
    async equipmentPark(
        @Parent() parent: EquipmentTechnical,
        @Context('equipmentParkLoader')
        equipmentParkLoader: Dataloader<number, EquipmentPark>,
    ) {
        return equipmentParkLoader.load(parent.equipment_park_id);
    }

    @ResolveField('genre', (returns) => EquipmentTechnicalGenre)
    async genre(
        @Parent() parent: EquipmentTechnical,
        @Context('equipmentTechnicalGenreLoader')
        equipmentTechnicalGenreLoader: Dataloader<
            number,
            EquipmentTechnicalGenre
        >,
    ) {
        return parent.genre_id
            ? equipmentTechnicalGenreLoader.load(parent.genre_id)
            : null;
    }

    @ResolveField('thumbnailCritAir', (returns) => EquipmentTechnicalThumbnail)
    async thumbnailCritAir(
        @Parent() parent: EquipmentTechnical,
        @Context('equipmentTechnicalThumbnailLoader')
        equipmentTechnicalThumbnailLoader: Dataloader<
            number,
            EquipmentTechnicalThumbnail
        >,
    ) {
        return parent.thumbnail_crit_air_id
            ? equipmentTechnicalThumbnailLoader.load(
                  parent.thumbnail_crit_air_id,
              )
            : null;
    }

    @ResolveField('pneumaticTypeOne', (returns) => Good)
    async pneumaticTypeOne(
        @Parent() parent: EquipmentTechnical,
        @Context('equipmentTechnicalGoodsLoader')
        equipmentTechnicalGoodsLoader: Dataloader<number, Good>,
    ) {
        return parent.pneumatic_type_one_id
            ? equipmentTechnicalGoodsLoader.load(parent.pneumatic_type_one_id)
            : null;
    }

    @ResolveField('pneumaticTypeTwo', (returns) => Good)
    async pneumaticTypeTwo(
        @Parent() parent: EquipmentTechnical,
        @Context('equipmentTechnicalGoodsLoader')
        equipmentTechnicalGoodsLoader: Dataloader<number, Good>,
    ) {
        return parent.pneumatic_type_two_id
            ? equipmentTechnicalGoodsLoader.load(parent.pneumatic_type_two_id)
            : null;
    }

    @ResolveField('gearboxLubricantType', (returns) => Good)
    async gearboxLubricantType(
        @Parent() parent: EquipmentTechnical,
        @Context('equipmentTechnicalGoodsLoader')
        equipmentTechnicalGoodsLoader: Dataloader<number, Good>,
    ) {
        return parent.gearbox_lubricant_type_id
            ? equipmentTechnicalGoodsLoader.load(
                  parent.gearbox_lubricant_type_id,
              )
            : null;
    }

    @ResolveField('bridgeLubricantType', (returns) => Good)
    async bridgeLubricantType(
        @Parent() parent: EquipmentTechnical,
        @Context('equipmentTechnicalGoodsLoader')
        equipmentTechnicalGoodsLoader: Dataloader<number, Good>,
    ) {
        return parent.bridge_lubricant_type_id
            ? equipmentTechnicalGoodsLoader.load(
                  parent.bridge_lubricant_type_id,
              )
            : null;
    }

    @ResolveField('engineLubricantType', (returns) => Good)
    async engineLubricantType(
        @Parent() parent: EquipmentTechnical,
        @Context('equipmentTechnicalGoodsLoader')
        equipmentTechnicalGoodsLoader: Dataloader<number, Good>,
    ) {
        return parent.engine_lubricant_type_id
            ? equipmentTechnicalGoodsLoader.load(
                  parent.engine_lubricant_type_id,
              )
            : null;
    }

    @ResolveField('daLubricantType', (returns) => Good)
    async daLubricantType(
        @Parent() parent: EquipmentTechnical,
        @Context('equipmentTechnicalGoodsLoader')
        equipmentTechnicalGoodsLoader: Dataloader<number, Good>,
    ) {
        return parent.da_lubricant_type_id
            ? equipmentTechnicalGoodsLoader.load(parent.da_lubricant_type_id)
            : null;
    }

    @ResolveField('hydrolicOilType', (returns) => Good)
    async hydrolicOilType(
        @Parent() parent: EquipmentTechnical,
        @Context('equipmentTechnicalGoodsLoader')
        equipmentTechnicalGoodsLoader: Dataloader<number, Good>,
    ) {
        return parent.hydrolic_oil_type_id
            ? equipmentTechnicalGoodsLoader.load(parent.hydrolic_oil_type_id)
            : null;
    }

    @Mutation(() => EquipmentTechnical, { name: 'updateEquipmentTechnical' })
    async update(
        @Args('data') data: UpdateEquipmentTechnicalInput,
    ): Promise<EquipmentTechnical> {
        return this.equipmentTechnicalService.update(data);
    }
}
