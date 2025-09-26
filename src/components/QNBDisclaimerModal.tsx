import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink } from 'lucide-react';

interface QNBDisclaimerModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onCancel: () => void;
}

export const QNBDisclaimerModal = ({ isOpen, onAllow, onCancel }: QNBDisclaimerModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="bg-white border-2 border-red-200 max-w-4xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 bg-red-50 border-b border-red-200 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-center text-red-800 flex items-center justify-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            Third Party Payment Gateway Notice
            <ExternalLink className="w-6 h-6 text-red-600" />
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 px-6 py-6 overflow-y-auto min-h-0">
          <div className="space-y-4">
            {/* Warning Box */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Important Notice</h3>
              </div>
              <p className="text-yellow-700 text-sm">
                You are about to be redirected to a third-party payment site operated by Qatar National Bank (QNB).
              </p>
            </div>

            {/* Main Disclaimer Text */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4 text-lg">
                Qatar Insurance Company (QIC) Disclaimer
              </h4>

              <div className="text-gray-700 text-sm leading-relaxed space-y-3">
                <p>
                  At your request, you are being re-directed to a third party site - Qatar National Bank (QNB) Payment Site,
                  wherein you can make your payment from a different bank account.
                </p>

                <p>
                  <strong>Qatar Insurance Company (QIC) does not guarantee or warrant</strong> the accuracy or completeness
                  of the information, materials, services or the reliability of any service, advice, opinion, statement or
                  other information displayed or distributed on the third party site.
                </p>

                <p>
                  You shall access this site <strong>solely for purposes of payment of your policy premium</strong> and you
                  understand and acknowledge that availing of any services offered on the site or any reliance on any opinion,
                  advice, statement, memorandum, or information available on the site <strong>shall be at your sole risk</strong>.
                </p>

                <p>
                  Qatar Insurance Company and its affiliates, subsidiaries, employees, officers, directors and agents,
                  <strong>expressly disclaim any liability</strong> for any deficiency in the services offered by Qatar National
                  Bank (QNB) whose site you are about to access.
                </p>

                <p>
                  <strong>Neither Qatar Insurance Company., nor any of its affiliates nor their directors, officers and employees
                  will be liable to or have any responsibility of any kind</strong> for any loss that you incur in the event of
                  any deficiency in the services of Qatar National Bank (QNB) to whom the site belongs, failure or disruption
                  of the site of Qatar National Bank (QNB), or resulting from the act or omission of any other party involved
                  in making this site or the data contained therein available to you, or from any other cause relating to your
                  access to, inability to access, or use of the site or these materials.
                </p>
              </div>
            </div>

            {/* Payment Gateway Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Payment Gateway Information</h4>
              </div>
              <div className="text-blue-700 text-sm space-y-1">
                <p><strong>Payment Provider:</strong> Qatar National Bank (QNB)</p>
                <p><strong>Purpose:</strong> Registration Fee Payment</p>
                <p><strong>Amount:</strong> QAR 1000.00 (Registration Fee)</p>
                <p><strong>Security:</strong> 256-bit SSL Encryption</p>
              </div>
            </div>

            {/* Risk Acknowledgment */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Risk Acknowledgment</h4>
              <div className="text-orange-700 text-sm space-y-2">
                <p>By clicking "Allow", you acknowledge that:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>You understand the risks associated with third-party payment processing</li>
                  <li>QIC is not responsible for any issues with the QNB payment gateway</li>
                  <li>You will use the payment site solely for premium payment purposes</li>
                  <li>Any disputes with payment processing must be resolved directly with QNB</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <div className="flex gap-4 justify-center">
            <Button
              onClick={onCancel}
              variant="outline"
              className="px-8 py-3 border-2 border-gray-300 hover:bg-gray-100 font-semibold"
            >
              Cancel Registration
            </Button>
            <Button
              onClick={onAllow}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              I Understand - Proceed to Payment
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-3">
            By proceeding, you accept full responsibility for the payment transaction and acknowledge the disclaimer above.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};