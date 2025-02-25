import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export default function QRCodeModal({ isOpen, onClose, url }: QRCodeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">QR 코드</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <QRCodeSVG
            value={url}
            size={200}
            level="H"
            includeMargin={true}
            className="shadow-lg rounded-lg"
          />
          <p className="text-sm text-gray-600 text-center mt-4">
            일도짐 QR 방문하기
          </p>
          <p className="text-sm text-gray-600 text-center mt-4">
           카메라를 QR 코드에 갖다 대주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
