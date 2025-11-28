<template>
  <div></div>
</template>

<script setup>
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx'
import { saveAs } from 'file-saver'

const props = defineProps({
  cartItems: {
    type: Array,
    required: true,
  },
  buyerInfo: {
    type: Object,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['generated'])

const generate = async () => {
  const orderDate = new Date().toLocaleDateString('pt-BR')
  const orderNumber = `VC-${Date.now()}`

  // Group items by producer
  const itemsByProducer = {}
  props.cartItems.forEach(item => {
    const producerId = item.product.producerId
    if (!itemsByProducer[producerId]) {
      itemsByProducer[producerId] = {
        producerName: item.product.producerName,
        origin: item.product.origin,
        items: []
      }
    }
    itemsByProducer[producerId].items.push(item)
  })

  // Create document sections
  const sections = []

  // Header
  sections.push(
    new Paragraph({
      text: "CONTRATO DE COMPRA SUSTENTÁVEL",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: "Vitrine do Cerrado",
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: `Pedido Nº: ${orderNumber}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: `Data: ${orderDate}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  )

  // Buyer Information
  sections.push(
    new Paragraph({
      text: "DADOS DO COMPRADOR",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Nome: ", bold: true }),
        new TextRun(props.buyerInfo.name),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Telefone: ", bold: true }),
        new TextRun(props.buyerInfo.phone),
      ],
      spacing: { after: 100 },
    })
  )

  if (props.buyerInfo.email) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "E-mail: ", bold: true }),
          new TextRun(props.buyerInfo.email),
        ],
        spacing: { after: 100 },
      })
    )
  }

  // Producer and Items Information
  Object.values(itemsByProducer).forEach((producer, index) => {
    sections.push(
      new Paragraph({
        text: `PRODUTOR ${index + 1}: ${producer.producerName.toUpperCase()}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Origem: ", bold: true }),
          new TextRun(producer.origin),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        text: "PRODUTOS:",
        bold: true,
        spacing: { after: 100 },
      })
    )

    let producerTotal = 0
    producer.items.forEach((item, itemIndex) => {
      const itemTotal = item.product.price * item.quantity
      producerTotal += itemTotal

      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${itemIndex + 1}. `, bold: true }),
            new TextRun({ text: item.product.name, bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: `   Quantidade: ${item.quantity} ${item.product.unit}`,
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: `   Preço Unitário: R$ ${item.product.price.toFixed(2).replace('.', ',')}`,
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: `   Subtotal: R$ ${itemTotal.toFixed(2).replace('.', ',')}`,
          spacing: { after: 100 },
        })
      )
    })

    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Total do Produtor: ", bold: true }),
          new TextRun({ text: `R$ ${producerTotal.toFixed(2).replace('.', ',')}`, bold: true }),
        ],
        spacing: { before: 200, after: 300 },
      })
    )
  })

  // Total
  sections.push(
    new Paragraph({
      text: "VALOR TOTAL DO PEDIDO",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({ 
          text: `R$ ${props.totalPrice.toFixed(2).replace('.', ',')}`, 
          bold: true,
          size: 32,
        }),
      ],
      spacing: { after: 400 },
    })
  )

  // Notes
  if (props.buyerInfo.notes) {
    sections.push(
      new Paragraph({
        text: "OBSERVAÇÕES",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        text: props.buyerInfo.notes,
        spacing: { after: 400 },
      })
    )
  }

  // Terms
  sections.push(
    new Paragraph({
      text: "TERMO DE COMPROMISSO SUSTENTÁVEL",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      text: "O comprador se compromete a:",
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "• Valorizar o trabalho dos produtores da sociobiodiversidade do Cerrado;",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Contribuir para a preservação do bioma Cerrado através do consumo consciente;",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Respeitar os prazos e acordos estabelecidos com os produtores;",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Promover a divulgação da bioeconomia regional sustentável.",
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: "Os produtores se comprometem a:",
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "• Fornecer produtos de qualidade, obtidos de forma sustentável;",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Manter práticas de extração e produção que preservem o meio ambiente;",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Cumprir com os prazos de entrega acordados;",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Manter a autenticidade e origem dos produtos comercializados.",
      spacing: { after: 600 },
    })
  )

  // Signatures
  sections.push(
    new Paragraph({
      text: "________________________________________",
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 100 },
    }),
    new Paragraph({
      text: "Assinatura do Comprador",
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: "________________________________________",
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "Assinatura do(s) Produtor(es)",
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: "---",
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 100 },
    }),
    new Paragraph({
      text: "Documento gerado automaticamente pela plataforma Vitrine do Cerrado",
      alignment: AlignmentType.CENTER,
      italics: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "Ideathon FAPTgulhas UniSaberes 2025",
      alignment: AlignmentType.CENTER,
      italics: true,
    })
  )

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  })

  // Generate and save
  const blob = await Packer.toBlob(doc)
  const filename = `Contrato_${orderNumber}_${orderDate.replace(/\//g, '-')}.docx`
  saveAs(blob, filename)

  // Save to order history
  saveToHistory({
    orderNumber,
    date: orderDate,
    buyerName: props.buyerInfo.name,
    totalPrice: props.totalPrice,
    itemsCount: props.cartItems.length,
    producers: Object.values(itemsByProducer).map(p => p.producerName),
    documentBlob: blob,
    filename: filename,
  })

  emit('generated', { blob, filename })
}

const getWhatsAppShareMessage = () => {
  const message = `📄 *Contrato de Compra - Vitrine do Cerrado*

Prezado Produtor,

Segue em anexo o contrato referente à sua venda através da nossa plataforma.

*Dados do Pedido:*
- Total: R$ ${props.totalPrice.toFixed(2).replace('.', ',')}
- Quantidade de itens: ${props.cartItems.length}

Atenciosamente,
Comprador via Vitrine do Cerrado`
  
  return encodeURIComponent(message)
}

const shareViaWhatsApp = () => {
  const message = getWhatsAppShareMessage()
  const whatsappUrl = `https://wa.me/?text=${message}`
  window.open(whatsappUrl, '_blank')
}

const shareViaEmail = () => {
  const subject = `Contrato de Compra - Vitrine do Cerrado`
  const body = getWhatsAppShareMessage().replace(/\*/g, '').replace(/%20/g, ' ')
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, '%0A'))}`
  window.open(mailtoLink)
}

const saveToHistory = (orderData) => {
  const history = JSON.parse(localStorage.getItem('orderHistory') || '[]')
  history.unshift(orderData)
  localStorage.setItem('orderHistory', JSON.stringify(history))
}

defineExpose({
  generate,
  shareViaWhatsApp,
  shareViaEmail,
  getWhatsAppShareMessage,
})
</script>
