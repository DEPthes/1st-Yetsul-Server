import { EntityRepository, Repository } from "typeorm";
import { SelectionDto } from "./dto/selection.dto";
import { Selection } from "./entities/selection.entity";

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