import { QRCodeCanvas } from 'qrcode.react';

const UpiQr = ({ amount }) => {
  const upiLink = `upi://pay?pa=rudransh1802@oksbi&pn=Rudransh&am=${amount}&cu=INR`;

  return (
    <div>
      <QRCodeCanvas value={upiLink} size={200} />
    </div>
  );
};

export default UpiQr;
