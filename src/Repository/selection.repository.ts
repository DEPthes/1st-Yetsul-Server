import { SelectionDto } from "src/DTO/selection.dto";
import { Selection } from "src/Entity/box_office/selection.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Selection)
export class SelectionRepository extends Repository<Selection> {

    // 답안 업로드
    async uploadSelection(selectionDto: SelectionDto): Promise<Selection> {

        const {selectionContent} = selectionDto;

        const selection = this.create({
            selectionContent
        })

        await this.save(selection);

        return selection;
    }

}