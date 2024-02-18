import { Command } from '../libs/bin/console/decorators/command.decorator';
import { AbstractCommand } from '../libs/bin/console/dto/abstract/abstract.command';
import { CommandArgsInterface } from '../libs/bin/console/dto/interface/command.args.interface';
import { COMMAND_REPONSE_CODE } from '../libs/bin/console/dto/enum/command.response.code.enum';
import { Input } from '../libs/bin/console/dto/terminal/terminal.input';
import { Output } from '../libs/bin/console/dto/terminal/terminal.output';
import * as dotenv from 'dotenv';
import { dump } from '../utils/utils';
import { SectionCodeService } from '../modules/section-code/service/section-code.service';
import { ExpensePostService } from '../modules/expense-post/service/expense-post.service';

dotenv.config();

@Command({ name: 'add:default:section-code:and:expense:post' })
export class AddDefaultSectionCodeAndExpensePostCommand extends AbstractCommand {
  public name = 'add:default:section-code:and:expense:post';

  public description = 'Adds default code sections and expense items';

  private _sectionCodes: any = [
    { code: '910190', designation: 'ACCESSOIRES VOIRIE - ELEMENTS BETON' },

    { code: '980170', designation: 'AMORTISSEMENT IMMOBILIER' },

    { code: '980160', designation: 'AMORTISSEMENT INFO ET BUREAUTIQUE' },

    { code: '980150', designation: 'AMORTISSEMENT MATERIEL' },

    { code: '920240', designation: 'APPOINTEMENTS PERSONNEL ADMINISTRATIF' },

    { code: '920237', designation: 'ASSISTANTE PROJET' },

    { code: '911110', designation: 'ASSURANCES' },

    { code: '920260', designation: 'AUTRES CHARGES SOCIALES' },

    {
      code: '980130',
      designation: 'C. BAIL ET LOCATION FI INFO ET BUREAUTIQUE',
    },

    { code: '980140', designation: 'C. BAIL ET LOCATION IMMOBILIERE' },

    { code: '980120', designation: 'C.BAIL ET LOCATION FI MATERIEL' },

    { code: '910110', designation: 'CABLES' },

    { code: '920232', designation: "CHARGE D'ETUDES BE" },

    { code: '920231', designation: "CHARGE D'ETUDES TRAVAUX" },

    { code: '920238', designation: 'CHARGE D’AFFAIRES' },

    { code: '913100', designation: 'CHARGES DIVERSES' },

    { code: '913110', designation: 'CHARGES NON INCORPORABLES' },

    { code: '920225', designation: 'CHEF TECHNICIEN OPTIQUE' },

    { code: '920230', designation: 'CONDUCTEURS DE TRAVAUX' },

    { code: '910180', designation: 'CONSOMMABLES CHANTIER' },

    { code: '920236', designation: 'DESSINATEUR-PROJETEUR' },

    { code: '913120', designation: 'ECRITURES BILAN' },

    { code: '910240', designation: 'ENERGIE' },

    { code: '910130', designation: 'ENROBES - BETON' },

    {
      code: '990100',
      designation: 'ENTRETIEN BIENS IMMOBILIERS OU FRAIS DE SITE',
    },

    { code: '950100', designation: 'ENTRETIEN REPARATION' },

    { code: '960100', designation: 'ENTRETIEN REPARATION GROUPE' },

    { code: '910140', designation: 'EPI - EPC' },

    { code: '911125', designation: 'FORMATION' },

    { code: '910250', designation: 'FOURNITURE ADMINISTRATIVE' },

    { code: '910230', designation: 'FOURNITURE MECANIQUE' },

    { code: '910260', designation: 'FRAIS BANCAIRES' },

    { code: '910220', designation: 'FRAIS DE CHANTIER DIVERS' },

    { code: '990110', designation: 'FRAIS DE DEPLACEMENT ET RECEPTION' },

    { code: '910270', designation: 'FRAIS DE TELEPHONIE ET POSTAUX' },

    { code: '910170', designation: 'FUEL - CARBURANTS - COMBUSTIBLE' },

    { code: '920999', designation: 'G.D. PREVISIONNEL' },

    { code: '910160', designation: 'GAINES - TUYAUTERIES - ACCESSOIRES' },

    { code: '911120', designation: 'HONORAIRES' },

    { code: '912100', designation: 'IMPOTS ET TAXES' },

    { code: '930100', designation: 'INTERIM' },

    { code: '980180', designation: 'INVESTISSEMENTS' },

    { code: '940100', designation: 'LOCATIONS DIVERSES' },

    { code: '960140', designation: 'LOCATIONS GROUPE' },

    { code: '910120', designation: 'LUMINAIRE + SUPPORT' },

    { code: '910210', designation: 'MARCHANDISES' },

    { code: '910150', designation: 'MATERIAUX ET DECHETS' },

    { code: '910100', designation: 'MATERIEL ELECTRIQUE' },

    { code: '920115', designation: 'OUVRIER MONTEUR' },

    { code: '920112', designation: 'OUVRIER SPE FO' },

    { code: '910135', designation: 'PAVES & BORDURES' },

    { code: '910200', designation: 'PETIT MATERIEL - OUTILLAGE' },

    { code: '920145', designation: 'PIQUETEUR' },

    { code: '960130', designation: 'PRESTATIONS GROUPE' },

    { code: '970110', designation: 'PROVISION POUR RISQUES ET CHARGES' },

    { code: '911100', designation: 'PUBLICITE ET COMMUNICATION' },

    { code: '920227', designation: 'RECETTEUR' },

    { code: '960111', designation: 'REGIE GROUPE' },

    { code: '920233', designation: 'RESPONSABLE BE' },

    { code: '960120', designation: 'RETROCESSION GROUPE' },

    { code: '920228', designation: 'SALAIRE NEGOCIATEUR IMMEUBLE' },

    { code: '920100', designation: 'SALAIRES APPRENTIS' },

    { code: '920210', designation: 'SALAIRES CHAUFFEURS' },

    { code: '920155', designation: 'SALAIRES CHEF DE CHANTIER' },

    { code: '920150', designation: "SALAIRES CHEF D'EQUIPE" },

    { code: '920190', designation: "SALAIRES CONDUCTEURS D'ENGINS" },

    { code: '920220', designation: 'SALAIRES ELECTRICIEN' },

    { code: '920235', designation: 'SALAIRES GEOMETRES' },

    { code: '920200', designation: 'SALAIRES MAGASIN' },

    { code: '920110', designation: 'SALAIRES MANOEUVRE' },

    { code: '920180', designation: 'SALAIRES MECANIQUE' },

    { code: '920125', designation: 'SALAIRES POSEUR AEP' },

    { code: '920130', designation: "SALAIRES POSEUR D'ENROBES" },

    { code: '920120', designation: 'SALAIRES POSEUR VOIRIE' },

    { code: '920170', designation: 'SALAIRES SOUDEURS ACIER' },

    { code: '920160', designation: 'SALAIRES SOUDEURS PE' },

    { code: '920140', designation: 'SALAIRES TERRASSIER-MACON' },

    { code: '920165', designation: 'SALAIRES TUYAUTEURS' },

    { code: '970100', designation: 'SINISTRES' },

    { code: '950120', designation: 'SOUS-TRAITANCE PAIEMENT DIRECT' },

    { code: '950110', designation: 'SOUS-TRAITANTS' },

    { code: '960110', designation: 'SOUS-TRAITANTS GROUPE' },

    { code: '920226', designation: 'TECHNICIEN OPTIQUE' },
  ];

  private _expensePosts: any = [
    'GROUPE',
    'FOURNITURE',
    'SOUS TRAITANCE',
    'LOCATION',
    'INTERIM',
    "MAIN D'OEUVRE",
    'MATERIEL',
    'FRAIS GENERAUX',
    'DIVERS',
  ];

  public constructor(
    private readonly _sectionCodeService: SectionCodeService,
    private readonly _expensePostService: ExpensePostService,
  ) {
    super();
  }

  public init(args: CommandArgsInterface): Promise<void> | void {
    return;
  }

  public async execute(
    input: Input,
    output: Output,
  ): Promise<COMMAND_REPONSE_CODE> {
    // Add default sections codes
    for (const sectionCode of this._sectionCodes) {
      // Check if exists
      const sectionCodeExists =
        await this._sectionCodeService.existByCodeAndDesignation(
          sectionCode.code,
          sectionCode.designation,
        );

      if (!sectionCodeExists) {
        // Add section code
        await this._sectionCodeService.create({
          code: sectionCode.code,
          designation: sectionCode.designation,
          active: true,
        });

        // Output success message
        output.success('Section code {section_code} added', {
          section_code: output.color(
            `${sectionCode.code} - ${sectionCode.designation}`,
            'warning',
          ),
        });
      }
    }

    // Add expense posts
    for (const expensePost of this._expensePosts) {
      // Check if exists
      const expensePostExists = await this._expensePostService.existByColumn(
        expensePost,
        'name',
      );

      if (!expensePostExists) {
        // Add expense post
        await this._expensePostService.create({
          name: expensePost,
          active: true,
        });

        // Output success message
        output.success('Expense post {expense_post} added', {
          expense_post: output.color(expensePost, 'warning'),
        });
      }
    }

    return COMMAND_REPONSE_CODE.SUCCESS;
  }
}
