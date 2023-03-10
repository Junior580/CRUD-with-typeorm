import aws from 'aws-sdk'
import nodemailer, { Transporter } from 'nodemailer'
import mailConfig from '@config/mail'

import { IMailTemplateProvider } from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider'
import IMailProvider from '../models/IMailProvider'
import ISendMailDTO from '../dtos/ISendMailDTO'

export class SESMailProvider implements IMailProvider {
  private client: Transporter

  constructor(private mailTemplateProvider: IMailTemplateProvider) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-1',
      }),
    })
  }

  public async sendMailMessage({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { email, name } = mailConfig.defaults.from
    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: { name: to.name, address: to.email },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    })

    // CONSOLE LOG PARA TESTAR POIS SES NAO ESTA CONFIGURADO
    console.log('Enviou email via SES')
  }
}
