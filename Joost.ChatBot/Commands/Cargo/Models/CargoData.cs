using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Joost.ChatBot.Commands.Cargo.Models
{
    public class CargoData
    {
        public string Number { get; set; }
        public int Redelivery { get; set; }
        public string RedeliverySum { get; set; }
        public string RedeliveryNum { get; set; }
        public string RedeliveryPayer { get; set; }
        public string OwnerDocumentType { get; set; }
        public string LastCreatedOnTheBasisDocumentType { get; set; }
        public string LastCreatedOnTheBasisPayerType { get; set; }
        public string LastCreatedOnTheBasisDateTime { get; set; }
        public string LastTransactionStatusGM { get; set; }
        public string LastTransactionDateTimeGM { get; set; }
        public string DateCreated { get; set; }
        public int CheckWeight { get; set; }
        public int SumBeforeCheckWeight { get; set; }
        public string PayerType { get; set; }
        public string RecipientFullName { get; set; }
        public string RecipientDateTime { get; set; }
        public string ScheduledDeliveryDate { get; set; }
        public string PaymentMethod { get; set; }
        public string CargoDescriptionString { get; set; }
        public string CargoType { get; set; }
        public string CitySender { get; set; }
        public string CityRecipient { get; set; }
        public string WarehouseRecipient { get; set; }
        public string CounterpartyType { get; set; }
        public string AfterpaymentOnGoodsCost { get; set; }
        public string ServiceType { get; set; }
        public string UndeliveryReasonsSubtypeDescription { get; set; }
        public int WarehouseRecipientNumber { get; set; }
        public string LastCreatedOnTheBasisNumber { get; set; }
        public string WarehouseRecipientInternetAddressRef { get; set; }
        public string MarketplacePartnerToken { get; set; }
        public string ClientBarcode { get; set; }
        public string SenderAddress { get; set; }
        public string RecipientAddress { get; set; }
        public string CounterpartySenderDescription { get; set; }
        public string CounterpartyRecipientDescription { get; set; }
        public string CounterpartySenderType { get; set; }
        public string DateScan { get; set; }
        public string PaymentStatus { get; set; }
        public string PaymentStatusDate { get; set; }
        public string AmountToPay { get; set; }
        public string AmountPaid { get; set; }
        public string LastAmountTransferGM { get; set; }
        public string LastAmountReceivedCommissionGM { get; set; }
        public int DocumentCost { get; set; }
        public double DocumentWeight { get; set; }
        public string AnnouncedPrice { get; set; }
        public string RecipientWarehouseTypeRef { get; set; }
        public string RedeliveryPaymentCardRef { get; set; }
        public string RedeliveryPaymentCardDescription { get; set; }
        public string OwnerDocumentNumber { get; set; }
        public string Status { get; set; }
        public string StatusCode { get; set; }
        public string RefEW { get; set; }
        public string DatePayedKeeping { get; set; }
    }
}